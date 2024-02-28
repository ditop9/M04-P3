var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
  {id: 1, name: "Volkswagen", country: "Alemania", year: 1937, founder: "Gobierno alemán", car: "Golf"},
  {id: 2, name: "Toyota", country: "Japón", year: 1937, founder: "Kiichiro Toyoda", car: "Corolla"},
  {id: 3, name: "Ford", country: "EEUU", year: 1903, founder: "Henry Ford", car: "Fiesta"},
  {id: 4, name: "Seat", country: "España", year: 1950, founder: "", car: "Ibiza"},
  {id: 5, name: "Bugatti", country: "Italia", year: 1998, founder: "Ettore Bugatti", car: "Chiron"}
]
let cars = [
  {id: 1, name: "Golf", idbrand: 1, brandName: "Volkswagen", cylinder: "1.0L", power: "110cv", price: "31.000€"},
  {id: 2, name: "Corolla", idbrand: 2, brandName: "Toyota", cylinder: "1.8L", power: "140cv", price: "28.000€"},
  {id: 3, name: "Fiesta", idbrand: 3, brandName: "Ford", cylinder: "1.0L", power: "90cv", price: "12.000€"},
  {id: 4, name: "Ibiza", idbrand: 4, brandName: "Seat", cylinder: "1.0L", power: "75cv", price: "14.000€"},
  {id: 5, name: "Chiron", idbrand: 5, brandName: "Bugatti", cylinder: "8.0L", power: "1500cv", price: "2.400.000€"}
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

// Insert elements

app.get('/insert_brand', (req, res) => {
  res.render('insert_brand', {
    title: 'Insertar Marcas',
    brand: brands
  })
})

app.get('/insert_car', (req, res) => {
  res.render('insert_car', {
    title: 'Insertar Coches',
    cars: cars
  })
})

// Search single element

function searchElementById(elementId, arr) {
  let foundElemet = null;
  arr.forEach(element => {
    if (element.id === elementId) {
      foundElemet = element;
    }
  });
  if (foundElemet) {
    return foundElemet;
  } else {
    throw new Error('ERROR 404 ELEMENT NOT FOUND');
  }
}
app.get('/search_car', (req, res) => {
  try {
    const carId = parseInt(req.query.id)
    const car = searchElementById(carId, cars)
    res.render('single_car', {
      title: "Buscador de coches",
      car: car
    })
  } catch (error) {
    res.status(404).send(error.message)
  }
})

app.get('/search_brand', (req, res) => {
  try {
    const brandId = parseInt(req.query.id)
    const brand = searchElementById(brandId, brands)
    res.render('single_brand', {
      title: "Buscador de marcas",
      brand: brand
    })
  } catch (error) {
    res.status(404).send(error.message)
  }
})

// Delete car elements
app.delete('/api/cars/:id', (req, res)=>{
  const id = parseInt(req.params.id)
  let foundIndex = -1
  for (let i = 0; i < cars.length ; i++) {
    if (cars[i].id === id){
      foundIndex = i
      break;
    }
  }
  if (foundIndex === -1){
    res.status(404).send('not found')
  }else {
    cars.splice(foundIndex,1)
    res.status(204).send()
  }
})

// Delete brand elements

app.delete('/api/brands/:id', (req, res)=>{
  const id = parseInt(req.params.id)
  let foundIndex = -1
  for (let i = 0; i < brands.length ; i++) {
    if (brands[i].id === id){
      foundIndex = i
      break;
    }
  }
  if (foundIndex === -1){
    res.status(404).send('not found')
  }else {
    brands.splice(foundIndex,1)
    res.status(204).send()
  }
})

// Insert new brand

app.post('/api/insert_brand',(req, res)=>{
  let params = req.body
  params.id = brands.length +1
  brands.push(params)
  res.redirect('/brands')
})

// Insert new car
app.post('/api/insert_car',(req, res)=>{
  let params = req.body
  params.id = cars.length +1
  cars.push(params)
  res.redirect('/cars')
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
