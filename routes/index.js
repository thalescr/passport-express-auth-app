const router = require('express').Router();
const userController = require('../controllers/user');
const {ensureGuest, ensureAuthenticated} = require('../libs/auth');

// Home
router.get('/', function(req, res) {
    res.render('home');
});

// Login
router.get('/login', ensureGuest, userController.login);

// Register
router.get('/register', ensureGuest, userController.register);

// Logout
router.get('/logout', ensureAuthenticated, userController.logout);

// Profile
router.get('/profile', ensureAuthenticated, userController.profile);

// Login post
router.post('/login', userController.postLogin);

// Register post
router.post('/register', userController.postRegister);


module.exports = router;