const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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
    
    res.status(200).json({
        success: true,
        token
    })
})