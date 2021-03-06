require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');
const sass = require('node-sass-middleware');
const app = express();

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const pino = require('pino')();
const knexLogger = require('knex-logger');

// Separated Routes for each Resource
const usersRoutes = require('./routes/users');

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static('public'));

app.use(cookieSession({
  secret: process.env.SESSION_SECRET || 'development'
}));
app.use(flash());

// Mount all resource routes
app.use(usersRoutes(knex));

// Home page
app.get('/', (req, res) => {
  res.render('index', {
    errors: req.flash('error'),
    loggedIn: !!req.session.user_id,
    counter: (req.session.counter || 0)
  });
});

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT);
});
