//require files
var express = require('express');
var helpers = require('../utils/helpers.js');
var router = require('./routers.js');


//import database
var db = require('../db');
var users = require('../db/models/users.js');
var todos = require('../db/models/todos.js');


//crypting stuff
// var crypto = require('crypto');
// var bcrypt = require('bcrypt-nodejs');



//session , cookieParser , don't know
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var partials = require('express-partials');
// app.use(partials());
// app.use(cookieParser('shhhh, very secret'));
// app.use(session({
//   secret: 'shhh, it\'s a secret',
//   resave: false,
//   saveUninitialized: true
// }));


//require middle ware 
var bodyParser = require('body-parser');
var morgan = require('morgan');


//use mid-war
//app.use(bodyParser.json())
app.use(morgan('dev'));
app.use(parser.json());
app.use('/classes', router);
//app.use(express.static(__dirname + '/../client'));



var app = express();
app.listen(process.env.PORT || port , function(){});

module.exports.app = app;



