const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUploader = require('express-fileupload');

// const dotenv = require('dotenv');
const path = require('path');

const errorMiddleware = require('./middlewares/errors')

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cookieParser())
app.use(fileUploader());

//impost all routes
const products = require('./routes/product')
const auth = require('./routes/auth')
const payment = require('./routes/payment')
const order = require('./routes/order')


app.use('/api/v1', products)
app.use('/api/v1', payment)
app.use('/api/v1', auth)
app.use('/api/v1', order)

app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//testing stats
// middleware for errors
app.use(errorMiddleware)

module.exports = app;