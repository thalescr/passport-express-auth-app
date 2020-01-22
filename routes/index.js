const router = require('express').Router();

// Home
router.get('/', function(req, res) {
    res.render('home');
});

// Login
router.get('/login', function(req, res) {
    res.render('pages/login');
});

// Login form post
router.post('/login', function(req, res) {
    res.send('Successfully connected: Email: ' + req.body.email + ' Senha: ' + req.body.password);
});

// Register
router.get('/register', function(req, res) {
    res.render('pages/register');
});

// Register form post
router.post('/register', function(req, res) {
    res.send('Successfully registered');
});

module.exports = router;