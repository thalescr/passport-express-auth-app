const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new LocalStrategy({usernameField: 'email'}, function(email, password, done) {
        User.findOne({email: email}).then(function(user) {
            if(!user) {
                console.log('User not found');
                return done(null, false);
            }
            bcrypt.compare(password, user.password, function(error, isMatch) {
                if(error) {
                    trow;
                }
                if(isMatch) {
                    return done(null, error);
                }
                else {
                    console.log('Password incorrect');
                    return done(null, false);
                }
            });
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(error, user) {
            done(error, user);
        });
    });
}