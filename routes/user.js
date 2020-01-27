const router = require('express').Router();
const userController = require('../controllers/user');
const {ensureGuest, ensureAuthenticated} = require('../libs/auth');

// Login
router.get('/login', ensureGuest, userController.login);

// Register
router.get('/register', ensureGuest, userController.register);

// Logout
router.get('/logout', ensureAuthenticated, userController.logout);

// Profile
router.get('/profile', ensureAuthenticated, userController.profile);

// Change password
router.get('/change-password', ensureAuthenticated,
userController.changePassword);

// Login post
router.post('/login', userController.postLogin);

// Register post
router.post('/register', userController.postRegister);

// Change name post
router.post('/change-name', userController.postChangeName);

// Change email post
router.post('/change-email', userController.postChangeEmail);

// Change password post
router.post('/change-password', userController.postChangePassword);

module.exports = router;