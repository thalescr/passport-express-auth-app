const mongoose = require('mongoose');
const {MONGO_URL} = require('../config/');

// Safety warning definitions
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

// Attempt to connect
mongoose.connect(MONGO_URL).then(function() {
    console.info('Database connected');
}).catch(function(error) {
    console.log('Database connection error: ' + error);
});