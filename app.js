const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

require('./libs/db-connection');

// Variables
const port = process.env.PORT || 8081;

// Config
    // Body Parser
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    // Template Engine
    app.set('view engine', 'ejs');

    // Routes
    app.use(require('./routes/'));

// Run server
app.listen(port, function() {
console.info(`Server running on http://127.0.0.1:${port}`);
});