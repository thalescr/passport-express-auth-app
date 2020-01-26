const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

function initialize(passport) {
    const authenticateUser = function(email, password, done) {
        // Find the user with an email
        User.findOne({email: email}).then(function(user) {
            if (!user) {
                return done(null, false, {message: 'Tentativa de login inválida'}); // No user found
            }

            // Attempt to login
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Tentativa de login inválida'}); // Password incorrect
                }
            })
        });

    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            return done(err, user);
        });
    });
}

module.exports = initialize;
