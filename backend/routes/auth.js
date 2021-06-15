const express = require('express');
const router = express.Router();

const {
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile,
    updatePassword
} = require('../controllers/userController');

const { isAthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAthenticatedUser, getUserProfile)
router.route('/password/update').put(isAthenticatedUser, updatePassword)




module.exports = router