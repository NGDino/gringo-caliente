const express = require('express');
const router = express.Router();

const {
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    singleUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { isAthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAthenticatedUser, getUserProfile)
router.route('/password/update').put(isAthenticatedUser, updatePassword)
router.route('/me/update').put(isAthenticatedUser, updateProfile);

//admin
router.route('/admin/users').get(isAthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id')
    .get(isAthenticatedUser, authorizeRoles('admin'), singleUser)
    .put(isAthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAthenticatedUser, authorizeRoles('admin'), deleteUser)


module.exports = router