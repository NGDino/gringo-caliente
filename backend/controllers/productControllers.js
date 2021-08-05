const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const APIFeatures= require('../utils/apiFeatures')

//Create new product =>  /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

// get all products
exports.getProducts = catchAsyncErrors(async (req, res, next)=>{

    const resPerPage = 4;
    const productsCount = await Product.countDocuments();
    
    const apiFeatures = new APIFeatures(Product.find(), req.query)
                .search()
                .filter()

            let products = await apiFeatures.query;
            let filteredProductsCount = products.length
                
            apiFeatures.pagination(resPerPage)

    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })
})

exports.getAdminProducts = catchAsyncErrors(async (req, res, next)=>{
    
    const products = await Product.find()

    res.status(200).json({
        success: true,
        products
    })
})

//get product by id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }


    res.status(200).json({
        success: true,
        product
    })

})


//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    })

    
})

//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        await product.remove();
        res.status(200).json({
            success: true,
            message: 'product deleted'
        })

})


//Create new Review => api/v1/reviews/
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);


    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating
            }
        })

    }else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false})

    res.status(200).json({
        success: true,
    })

})

//get product reviews => /api/v1/reviews

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//delete product reviews => /api/v1/reviews

exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review => review._id.toString() != req.query.id.toString());

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})