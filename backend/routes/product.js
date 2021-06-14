const express = require('express')
const router = express.Router();

const {
        getProducts, 
        newProduct, 
        getSingleProduct, 
        updateProduct, 
        deleteProduct
} = require('../controllers/productControllers');
    
const { isAthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/products').get( getProducts);
router.route('/product/:id').get(getSingleProduct)

router.route('/admin/product/new').post(isAthenticatedUser, authorizeRoles('admin'), newProduct)

router.route('/admin/product/:id')
    .put(isAthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAthenticatedUser, authorizeRoles('admin'), deleteProduct)



module.exports = router;