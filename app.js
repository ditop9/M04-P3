var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {router} = require("express/lib/application");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let brands = [
  {id: 1, name: "Volkswagen", country: "Germany"},
  {id: 2, name: "Toyota", country: "Japan"},
  {id: 3, name: "Ford", country: "USA"},
  {id: 4, name: "Seat", country: "Spain"},
  {id: 5, name: "Bugatti", country: "Italy"}
]
let cars = [
  {id: 1, name: "Golf", idbrand: 1},
  {id: 2, name: "Corolla", idbrand: 2},
  {id: 3, name: "Fiesta", idbrand: 3},
  {id: 4, name: "Ibiza", idbrand: 4},
  {id: 5, name: "Chiron", idbrand: 5}
]

//// ENDPOINTS ////

app.get('/', (req, res) => {
  res.render('index', {title: 'Cars&Brands'})
})

app.get('/brands', (req, res) => {
  res.render('brands', {title: 'Marcas'})
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
