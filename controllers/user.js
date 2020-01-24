const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');


module.exports = {
    // GET endpoints
    login: function(req, res) {
        res.render('pages/login');
    },
    register: function(req, res) {
        res.render('pages/register');
    },
    logout: function(req, res) {
        req.logout();
        res.redirect('/login');
    },
    profile: function(req, res) {
        res.render('pages/profile');
    },

    // POST endpoints
    postRegister: function(req, res) {
        let error;
        
        // Different passwords error
        if (req.body.password !== req.body.rpassword) {
            error = 'As senhas não conferem'; 
    
        // Small password error
        } else if (req.body.password.length < 8) {
            error = 'A senha deve conter ao menos 8 caracteres';
        }

        // Attempt to find a user with requested email
        User.findOne({email: req.body.email}).then(function(user) {
            // User already exists
            if (user) {
                error = 'O email inserido já foi registrado';
            }
        }).catch();
    
        // Check for errors
        if (error) {
            res.render('pages/register', {
                messages: {error: error},
                name: req.body.name,
                email: req.body.email,
            });
    
        } else {
            const hash = bcrypt.hash(req.body.password, 10, function(err) {
                if(err) {
                    console.log('Error when hashing password: ' + err);
                }
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })
            try {
                newUser.save();
                res.redirect('/login');
            }
            catch (error) {
                console.log('Failed to register user: ' + error);
            }
        }
    },
    postLogin: function(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/secret',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }
};