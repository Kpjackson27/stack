'use strict';

//load the module dependencies
var config = require('./config'),
    http = require('http'),
    socketio = require('socket.io'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    multer = require('multer'),
    flash = require('express-flash'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    _ = require('lodash'),
    cookieParser = require('cookie-parser'),
    lusca = require('lusca'),
    expressValidator = require('express-validator'),
    errorHandler = require('errorhandler'),
    passport = require('passport');
    // url = require('url'),
    // redis = require('redis')

// var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
// var client = redis.createClient(redisURL.port, redisURL.hostname, {
//     no_ready_check: true
// });
// client.auth(redisURL.auth.split(":")[1]);
var raccoon = require('raccoon');
raccoon.connect(6379, '127.0.0.1');

// raccoon.connect(redisURL.port, redisURL.hostname, redisURL.auth.split(":")[1]);



//Create a new error handling controller method
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

//Define express configuration
module.exports = function(db) {
    //create new express application instance
    var app = express();

    //create new HTTP server
    var server = http.createServer(app);

    //create a new socket.io server
    var io = socketio.listen(server);

    //Use the 'NODE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    //Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    //Configure multer module
    app.use(multer({
        dest: ('uploads')
    }));

    //Configure express validator module
    app.use(expressValidator());

    //Configure the MongoDB session storage
    var mongoStore = new MongoStore({
        db: db.connection.db
    });


    //Configure the 'session' middleware
    app.use(session({
        saveUnitialized: true,
        resave: true,
        // secret: config.sessionSecret,
        secret: 'developmentSessionSecret',
        store: mongoStore
    }));

    //set application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.use(compress());




    //configure the flash messages middleware
    app.use(flash());

    //configure the lusca security middleware
    app.use(lusca({
        csrf: true,
        xframe: 'SAMEORIGIN',
        xssProtection: true
    }));


    //Configure passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, res, next) {
        res.locals.user = req.user;
        next();
    });
    //Configure error handler module
    app.use(errorHandler());
    app.locals.moment = require('moment');

    // app.use(function(req, res, next) {
    //      if (/api/i.test(req.path)) req.session.returnTo = req.path;
    //      next();
    // });
    // app.use(session({
    //    resave: true,
    //    saveUninitialized: true,
    //    secret: secrets.sessionSecret,
    //    store: new MongoStore({ url: secrets.db, autoReconnect: true })
    // }));


    //Load the routing files
    require('../app/routes/index.js')(app);
    //require('../app/routes/landing.js')(app);
    require('../app/routes/main.js')(app);
    require('../app/routes/users.js')(app);
    require('../app/routes/articles.js')(app);
    require('../app/routes/about.js')(app);
    require('../app/routes/discover.js')(app);
    require('../app/routes/recommendations.js')(app);

    //render static files
    app.use(express.static('./public'));
    //load socket.io configuration
    require('./socketio')(server, io, mongoStore);


    return server;
};