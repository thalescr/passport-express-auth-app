const router = require('express').Router();

// Main route
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;