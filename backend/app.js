const express = require('express');
const app = express();

const dotenv = require('dotenv');

const errorMiddleware = require('./middlewares/errors')

dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());

//impost all routes
const products = require('./routes/product')

app.use('/api/v1', products)

// middleware for errors
app.use(errorMiddleware)

module.exports = app;