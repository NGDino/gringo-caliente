const Order = require('../models/Order');
const Product = require('../models/Product');

const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({ 
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json ({
        success: true,
        order
    })
})

//get single order => /api/v1/order/:id
exports.singleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order){
        return next(new ErrorHandler('no order with this id', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})

//get single order => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id}).populate('user', 'name email');

    res.status(200).json({
        success: true,
        orders
    })
})

//get all orders => /api/v1/admin/orders

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order =>{
        totalAmount += order.totalPrice
    })
    console.log(totalAmount)

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
    if(error){
        console.log(error)
    }
})