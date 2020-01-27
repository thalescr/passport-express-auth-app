const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Checking functions
function checkPasswords(password, rpassword) {
    let error;

    // Different passwords error
    if (password !== rpassword) {
        error = 'As senhas não conferem';
    }

    // Small password error
    if (password.length < 8) {
        error = 'A senha deve conter ao menos 8 caracteres';
    }

    return error;
}

function checkUser(User, email) {
    let error;

    // Attempt to find a user with requested email
    User.findOne({email: email}).then(function(user) {
        // User already exists
        if (user) {
            error = 'O email inserido já foi registrado';
        }
    }).catch(function(err) {
        console.log('Error when attempting to find a user: ' + err);
    });

    return error;
}

// User controllers
module.exports = {
    // GET endpoints
    login: function(req, res) {
        res.render('auth/login');
    },
    register: function(req, res) {
        res.render('auth/register');
    },
    logout: function(req, res) {
        req.logout();
        res.redirect('/user/login');
    },
    profile: function(req, res) {
        res.render('auth/profile', {user: req.user});
    },
    changePassword: function(req, res) {
        res.render('auth/changePassword');
    },

    // POST endpoints
    postRegister: function(req, res) {
        let error = checkPasswords(req.body.password, req.body.rpassword);

        // Check for errors in password
        if (error) {
            res.render('auth/register', {
                messages: {error: error},
                name: req.body.name,
                email: req.body.email,
            });

        } else {
            error = checkUser(User, req.body.email);

            // Check for errors in User
            if (error) {
                res.render('auth/register', {messages: {error: error}});
            }
            else {
                const hash = bcrypt.hash(req.body.password, 10, function(e, hash) {
                    if(e) {
                        console.log('Failed to register user: ' + e);
                    } else {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                
                        newUser.save();
                        res.redirect('/user/login');
                    }
                });
            }
        }
    },

    postLogin: function(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/user/profile',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    },

    postChangeName: function(req, res) {
        req.user.name = req.body.name;
        req.user.save();
        res.redirect('/user/profile');

    },

    postChangeEmail: function(req, res) {
        let error = checkUser(User, req.body.email);

        // Check for errors
        if (error) {
            res.render('auth/profile', {
                messages: {error: error}
            });
        
        } else {
            req.user.email = req.body.email;
            req.user.save();
            res.redirect('/user/profile');
        }

    },

    postChangePassword: function(req, res) {
        let error = checkPasswords(req.body.password, req.body.rpassword);

        // Check for errors
        if (error) {
            res.render('auth/change-password', {messages: {error: error}});
    
        } else {
            const hash = bcrypt.hash(req.body.password, 10, function(e, hash) {
                if(e) {
                    console.log('Failed to hash new user password: ' + e);
                } else {
                    req.user.password = hash;
                    req.user.save();
                    res.redirect('/user/profile');
                }
            });
        }
    }
};