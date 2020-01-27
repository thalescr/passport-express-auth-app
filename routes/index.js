const router = require('express').Router();

// Home
router.get('/', function(req, res) {
    res.render('home');
});

module.exports = router;