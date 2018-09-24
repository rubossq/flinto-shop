const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const env = process.env.NODE_ENV || 'development';
const Config = require('./app/config.json')[env];
const Constant = require('./app/libs/Constant');
const mongoose = require('mongoose');
const passport = require('passport');
const fs = require('fs');

let expressSanitizer = require('express-sanitizer');

// Bootstrap models
fs.readdirSync(path.join(__dirname, Constant.APP_MODELS))
    .filter(function (file) {
        return file.indexOf('.js');
    })
    .forEach(function (file) {
        require(path.join(path.join(__dirname, Constant.APP_MODELS), file));
    });

let main = require('./app/routes/main');
let admin = require('./app/routes/admin');
let hbs = require('hbs');

const app = express();

mongoose.connect(Config.MONGO_URL + Config.MAIN_DB);

hbs.registerPartials(path.join(__dirname, 'app/views/parts'));
hbs.registerHelper('ifCond', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(session({
    store: new MongoStore({url: Config.MONGO_URL + Config.SESSIONS_DB}),
    secret: Config.MONGO_SECRET,
    resave: false,
    saveUninitialized: false
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
require('./app/passport/passport').init(passport);


app.use('/admin', admin);
app.use('/', main);


app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.get('/', function (req, res) {
    res.send('Hello');
});

// catch 404 and forward to error handler
app.use(notFound404);

app.listen(8000, function () {
    console.log('app launched');
});

function logErrors(err, req, res, next) {
    console.error(JSON.stringify(err));
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({error: 'Something failed!', message: err.message, status: err.status});
    } else {
        next(err);
    }
}

function notFound404(req, res, next) {
    res.status(404);
    res.render('pages/404', {layout: 'layouts/main_layout', title: 'Not found'});
}

function errorHandler(err, req, res, next) {

    if (err.status === 404) {
        return notFound404(req, res, next);
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}