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

    const resPerPage = 2;
    const productCount = await Product.countDocuments();
    
    const apiFeatures = new APIFeatures(Product.find(), req.query)
                .search()
                .filter()
                .pagination(resPerPage)

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
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
    console.log(product.reviews)


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
