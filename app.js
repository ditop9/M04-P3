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
  {id: 1, name: "Golf", idbrand: 1, brandName: "Volkswagen"},
  {id: 2, name: "Corolla", idbrand: 2, brandName: "Toyota"},
  {id: 3, name: "Fiesta", idbrand: 3, brandName: "Ford"},
  {id: 4, name: "Ibiza", idbrand: 4, brandName: "Seat"},
  {id: 5, name: "Chiron", idbrand: 5, brandName: "BUgatti"}
]

// ENDPOINTS

app.get('/', (req, res) => {
  res.render('index', {title: 'Cars&Brands'})
})

// Adding data

app.get('/brands', (req, res) => {
  res.render('brands', {
    title: 'Marcas',
    brands: brands
  })
})

app.get('/cars', (req, res) => {
  res.render('cars', {
    title: 'Coches',
    cars: cars
  })
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
