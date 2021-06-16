const express = require('express');
const router = express.Router();

const {
    newOrder, 
    singleOrder,
    myOrders,
    getAllOrders,

} = require('../controllers/orderController');

const { isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);

router.route('/order/:id').get(isAuthenticatedUser, singleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);




module.exports = router;