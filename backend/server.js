const app = require('./app');
const connectDatabase = require('./config/database');

const cloudinary = require('cloudinary');

//handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('shutting down server due to uncaught exception')
    process.exit(1)
})

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

//setting up config file


//connecting database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen (process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})
//handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`)
    console.log('Shutting down server due to unhandled promise rejection')
    server.close(() => {
        process.exit(1)
    })
})