const User = require('../models/User');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

//register a user handler
exports.registerUser = catchAsyncErrors(async (req, res, next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'v1623531940/otto.',
            url: 'https://res.cloudinary.com/gringo-caliente/image/upload/v1623531940/otto.jpg'
        }
    })
    const token = user.getJwtToken();

    sendToken(user, 200, res)

})

//login user => /api/vi/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checks if email and password is entered by user
    if(!email || !password){
        return next( new ErrorHandler('Please enter email and Password', 400))
    }
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorHandler('invalid Email or Password', 401));
    }
    //checks for correct pass
    const correctPassword = await user.comparePassword(password);

    if(!correctPassword){
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    sendToken(user, 200, res)

})
//forgot password route => /api/vi/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user) {
        return next(new ErrorHandler('user not found with this email', 404));

    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset link: \n\n ${resetUrl}\n\n if you have not requested this email, then ignore it.`

    try{
        await sendEmail({ 
            email: user.email,
            subject: 'Gringo Caliente password revovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email}`,
            user
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false})
        
    return next(new ErrorHandler(error.message, 500))
    }

})
//reset password => api/vi/password/reset/sendToken
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log(req.params.token)

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gte: Date.now() }
    })
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired', 400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

//get currently logged in user => api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

// logout user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next)=>{
    res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})