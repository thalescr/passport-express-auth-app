const mongoose = require('mongoose');

// Safety warning definitions
mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

// Attempt to connect
mongoose.connect('mongodb://localhost/project-db').then(function() {
    console.info('Database connected');
}).catch(function(error) {
    console.log('Database connection error: ' + error);
});