var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var spot = require('./routes/spot');
var auth = require('./routes/auth');

var app = express();

const PORT = process.env.PORT || 8080;

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/parkingspotslisting', { promiseLibrary: require('bluebird')})
    .then(() => console.log('connection succesfull'))
    .catch((err) => console.log(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.use('/api/spot', spot);
app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// error handler 
app.use(function(err,req, res, next) {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;