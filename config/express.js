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
    passport = require('passport'),
    cloudinary = require('cloudinary');

// var mongoose = require('mongoose'),
//     Article = mongoose.model('Article');
// url = require('url'),
// redis = require('redis')

// var redisURL = url.parse('redis://rediscloud:4kmgVo8PXPmJzJWH@pub-redis-17622.us-east-1-4.5.ec2.garantiadata.com:17622');
// var client = redis.createClient(redisURL.port, redisURL.hostname, {
//     no_ready_check: true
// });
// client.auth(redisURL.auth.split(":")[1]);

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
    //todo use secrets.js
    cloudinary.config({
        cloud_name: 'dqevqceyc',
        api_key: '443513514397748',
        api_secret: 'lprAeS7gCHRibLkpY5ZGpMcAbBo'
    });
    process.env.CLOUDINARY_URL = 'cloudinary://443513514397748:lprAeS7gCHRibLkpY5ZGpMcAbBo@dqevqceyc';
    if (typeof(process.env.CLOUDINARY_URL) == 'undefined') {
        console.warn('!! cloudinary config is undefined !!');
        console.warn('export CLOUDINARY_URL or set dotenv file');
    } else {
        console.log('cloudinary config:');
        console.log(cloudinary.config());
    }
    //Configure multer module
    app.use(multer({
        dest: ('./client/assets/images/uploads/')
    }));

    //Configure express validator module
    app.use(expressValidator());

    //Configure the MongoDB session storage
    var mongoStore = new MongoStore({
        db: db.connection.db
    });

    //warning: vexpress-session deprecated undefined saveUninitialized option; provide saveUninitialized option
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
    var User = require('mongoose').model('User');
    //todo : use should be logged in 
    // app.get('/api/recommendFor', passportConf.isAuthenticated, favorites.recommendFor);
    app.post('/profile', function(req, res) {
        console.log(req.files.file.path);
        cloudinary.uploader.upload(
            req.files.file.path, //file.path: file path on the server, need to delete folder files
            function(result) {
                // var upload = new Upload({
                //        public_id: result.public_id
                //    });
                // upload.creator = req.user;
                // console.log('result.url ' + result.url);
                //cloudinary url for thumb
                var newUrl = cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    crop: 'thumb',
                    gravity: 'face',
                    radius: '25'
                });
                console.log('newUrl: ' + newUrl);
                User.findById(req.user.id).exec(function(err, user) {
                    if (err) {
                        // Use the error handling method to get the error message
                        var message = getErrorMessage(err);
                        console.log(message);
                        // Set the flash messages
                        // req.flash('error', message);
                        return res.redirect('/');
                    }
                    // console.log('cloud: result.url:' + result.url);
                    user.profile.cloudinaryUrl = newUrl;
                    user.save(function(err) {
                        if (err) {
                            // Use the error handling method to get the error message
                            var message = getErrorMessage(err);
                            console.log(message);
                            // Set the flash messages
                            // req.flash('error', message);
                            return res.redirect('/');
                        }
                    });
                });
                // console.log(req.user.id);
            }
            // ,{
            //  // public_id:req.files.file.name, 
            //  crop: 'limit',
            //  width: 2000,
            //  height: 2000,
            //  eager: [
            //  { width: 200, height: 200, crop: 'thumb', gravity: 'face',
            //    radius: 20, effect: 'sepia' },
            //  { width: 100, height: 150, crop: 'fit', format: 'png' }
            //  ],                                     
            //  tags: ['special', 'for_homepage']
            // }

        );
    });
    //render static files
    app.use(express.static('./public'));
    //load socket.io configuration
    require('./socketio')(server, io, mongoStore);


    return server;
};