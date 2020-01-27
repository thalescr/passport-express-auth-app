const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Checking functions
function checkDifferentPasswords(password, rpassword, _error) {
    if(password !== rpassword) {
        error = 'As senhas não conferem';
    }
}

function checkSmallPassword(password, _error) {
    if(password.length < 8) {
        error = 'A senha deve conter ao menos 8 caracteres';
    }
}

function checkIfUserExists(User, email, _error) {
    // Attempt to find a user with requested email
    User.findOne({email: email}).then(function(user) {
        // User already exists
        if (user) {
            _error = 'O email inserido já foi registrado';
        }
    }).catch(function(err) {
        console.log('Error when attempting to find a user: ' + err);
    });
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
        let error;

        // Different passwords error
        checkDifferentPasswords(req.body.password, req.body.rpassword, error);
    
        // Small password error
        checkSmallPassword(req.body.password, error);

        // Attempt to find a user with requested email
        checkIfUserExists(User, req.body.email, error);
    

        // Check for errors
        if (error) {
            res.render('auth/register', {
                messages: {error: error},
                name: req.body.name,
                email: req.body.email,
            });
    
        } else {
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
    },
    postLogin: function(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/user/profile',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    },
    postChangeName: async function(req, res) {
        req.user.name = req.body.name;
        try {
            await req.user.save();
        }
        catch (err) {
            console.log('Error when updating user name: ' + err);
        }
        res.redirect('/user/profile');

    },
    postChangeEmail: async function(req, res) {
        let error;

        // Attempt to find a user with requested email
        checkIfUserExists(User, req.body.email, error);

        // Check for errors
        if (error) {
            res.render('auth/profile', {
                messages: {error: error}
            });
        
        } else {
            req.user.email = req.body.email;
            try {
                await req.user.save();
            }
            catch (err) {
                console.log('Error when updating user email: ' + err);
            }
            res.redirect('/user/profile');
        }

    },
    postChangePassword: function(req, res) {
        let error;

        // Different passwords error
        checkDifferentPasswords(req.body.password, req.body.rpassword, error);
    
        // Small password error
        checkSmallPassword(req.body.password, error);

        // Attempt to find a user with requested email
        checkIfUserExists(User, req.body.email, error);

        // Check for errors
        if (error) {
            res.render('auth/change-password', {messages: {error: error}});
    
        } else {
            const hash = bcrypt.hash(req.body.password, 10, async function(e, hash) {
                if(e) {
                    console.log('Failed to hash new user password: ' + e);
                } else {
                    req.user.password = hash;
                    try {
                        await req.user.save();
                    }
                    catch (err) {
                        console.log('Error when updating password: ' + err);         
                    }
                    res.redirect('/user/profile');
                }
            });
        }
    }
};