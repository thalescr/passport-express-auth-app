const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

function initialize(passport) {
    const authenticateUser = async function(email, password, done) {
        // Find the user with an email
        const user = User.findOne({email: email});
        if(user == null) {
            return done(null, false, {message: 'Invalid login'}); // No user found
        }

        // Attempt to login
        try {
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Invalid login'}); // Password incorrect
                }
            });
        }
        catch(error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        return done(null, User.getOne({id: id}));
    });
}

module.exports = initialize;
