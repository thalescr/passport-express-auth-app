const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

// Variables
const port = process.env.PORT || 8081;
const {MONGO_URL} = require('./config/');

// Database connection
require('./libs/db-connection');

// Config
    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Template Engine
    app.set('view engine', 'ejs');
    app.use(expressLayouts);

    // Sessions
    app.use(session({
        secret: 'aW31Rdp@$sw0rd',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            url: MONGO_URL,
            autoReconnect: true
        })
    }));

    // Static Files
    app.use(express.static(path.join(__dirname, '/public')));

    // Routes
    app.use(require('./routes/'));

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());
    require('./config/passport')(passport);

// Run server
app.listen(port, function() {
    console.info(`Server running on http://127.0.0.1:${port}`);
});