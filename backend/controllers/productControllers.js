const Product = require('../models/Product');

//Create new product =>  /api/v1/product/new
exports.newProduct = async (req, res, next) => {

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
}


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

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(505).json({
            success: false,
            message: 'That one is too hot, cannot find'
        })
    }

    res.status(200).json({
        success: true,
        product
    })
}