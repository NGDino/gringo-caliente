const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler')

//Create new product =>  /api/v1/product/new
exports.newProduct = async (req, res, next) => {

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}

// get all products
exports.getProducts = async (req, res, next)=>{
    const products = await Product.find()

    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
}
//get product by id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({
            success: true,
            product
        })
    }catch{
        return next(new ErrorHandler('product not found'))
    }

    

}

//update product
exports.updateProduct = async (req, res, next) => {
    try {
    let product = await Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })

    }catch{
            return next(new ErrorHandler('product not found'))
    }
    
}

//delete product
exports.deleteProduct = async (req, res, next) => {
    try{
        const product = await Product.findById(req.params.id);

        await product.remove();
        res.status(200).json({
            success: true,
            message: 'product deleted'
        })
    }catch{
        return next(new ErrorHandler('product not found'))
    }

}
