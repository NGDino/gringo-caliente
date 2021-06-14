
const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        console.log(err);

        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message;

        //wrong mongoose object ipaddr
        if(err.name === 'CastError'){
            const message= `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //handling mongoose validation error
        if(err.name === 'ValidatorError'){
            const message = Object.values(err.errors).map(value => value.message)
            error= new ErrorHandler(message, 400)
        }

        //handling mongoos duplicate key console.error
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`
            error= new ErrorHandler(message, 400)

        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

}