const User = require('../models/User');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken')

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