const express = require('express');
const router = express.Router();

const {
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile
} = require('../controllers/userController');

const { isAthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAthenticatedUser, getUserProfile)



module.exports = router