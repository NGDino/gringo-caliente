const User = require('../models/User')
const catchAsyncErrors= require('./catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

// checks if authenticated user
exports.isAthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies
    console.log(token)
    if(!token) {
        return next(new ErrorHandler('Login first to access this resource', 401))
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})