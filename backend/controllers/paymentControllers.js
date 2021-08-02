const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const stripe = require('stripe').Stripe(process.env.STRIPE_SECRET_KEY);

// process stripe payments = /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        corrency: 'usd',

        metadata: {
            integration_check: 'accept_a_payment'
        }
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.clientSecret,
    })
})