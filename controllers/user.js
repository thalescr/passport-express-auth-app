const router = require('express').Router();
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
    postRegister: async function(req, res) {
        let errors = [];

        // Different passwords error
        if(req.body.password != req.body.rpassword) {
            res.render('page/register', {message: 'As senhas não coincidem'});
        }

        // Small password error
        if(req.body.password.length < 8) {
            res.render('page/register', {message: 'A senha deve conter ao menos 8 caracteres'});
        }
        // Check for errors
        if(errors) {
            res.render('pages/register', {
                message,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                rpassword: req.body.rpassword
            });
        }
        else {
            User.findOne({email: req.body.email}).then(function(user) {
                if(user) {
                    // Email already registered error
                    errors.push({message: 'Email já cadastrado'});
                    res.render('pages/register', {errors, name: '', email: '', password: '', rpassword: ''});
                }
                else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(newUser.password, salt, function(err, hash) {
                            if(err) {
                                throw err;
                            }
                            newUser.password = hash;
                            newUser.save().then(function(user) {
                                console.log(`User ${user.name} successfully registered!`);
                                res.redirect('/login');
                            }).catch(function(err) {
                                console.log('Error when encrypting: ' + err)
                            });
                        });
                    });
                }
            });
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