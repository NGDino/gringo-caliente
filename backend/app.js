const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errors')

app.use(express.json());

//impost all routes
const products = require('./routes/product')

app.use('/api/v1', products)

// middleware for errors
app.use(errorMiddleware)

module.exports = app;