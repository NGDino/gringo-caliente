const User = require('../models/User');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary');

//register a user handler
exports.registerUser = catchAsyncErrors(async (req, res, next)=>{

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatar',
        width: 150,
        crop: "scale"
    })
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
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

//change password of logged in user => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check previous user Password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorect'));
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
})

//update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avater !== ''){
        const user= await User.findById(req.user.id)
        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id)
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatar',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar= {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,

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

// admin routes
//get all users => /api/v1/admin/userSchema
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//get user details => /api/v1/admin/user/id
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 500))
    }

    res.json({
        success: true,
        user
    })
});

//admin update => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
        if(!user) {
        return next(new ErrorHandler('user not found with this email', 404));

    }

    res.status(200).json({
        success: true,

    })
});

//admin delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with the id: ${req.params.id}`, 500))
    }

    //remove avatar from cloudinary TODO

    await user.remove()

    res.json({
        success: true,
    })
});

