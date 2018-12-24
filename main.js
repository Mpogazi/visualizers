// Declaring global variables
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const flash = require('flash');
const passport = require('passport');
const expressValidator = require('express-validator');
const session = require('express-session');

// Required controllers and models
const apiController = require('./controllers/api');

// Configs for the app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

// API for /
app.get('/', apiController.getIndex);
app.get('/index', apiController.getIndex);

var PRINT = console.log;

app.listen(process.env.PORT || 3000, PRINT("App running on localhost:3000"));
