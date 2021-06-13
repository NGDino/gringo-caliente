const express = require('express')
const router = express.Router();

const {
        getProducts, 
        newProduct, 
        getSingleProduct, 
        updateProduct, 
        deleteProduct
} = require('../controllers/productControllers');
    
const { isAthenticatedUser } = require('../middlewares/auth')

router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct)

router.route('/admin/product/new').post(isAthenticatedUser, newProduct)

router.route('/admin/product/:id')
    .put(isAthenticatedUser, updateProduct)
    .delete(isAthenticatedUser, deleteProduct)



module.exports = router;