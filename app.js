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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let brands = [
    {id: 1, name: "Volkswagen", country: "Alemania", year: 1937, founder: "Gobierno alemán", car: "Golf"},
    {id: 2, name: "Toyota", country: "Japón", year: 1937, founder: "Kiichiro Toyoda", car: "Corolla"},
    {id: 3, name: "Ford", country: "EEUU", year: 1903, founder: "Henry Ford", car: "Fiesta"},
    {id: 4, name: "Seat", country: "España", year: 1950, founder: "", car: "Ibiza"},
    {id: 5, name: "Bugatti", country: "Italia", year: 1998, founder: "Ettore Bugatti", car: "Chiron"}
]
let idBrands = 6
let cars = [
    {id: 1, name: "Golf", brandName: "Volkswagen", cylinder: 1000, power: 110, price: 31000},
    {id: 2, name: "Corolla", brandName: "Toyota", cylinder: 1800, power: 140, price: 28000},
    {id: 3, name: "Fiesta", brandName: "Ford", cylinder: 1000, power: 90, price: 12000},
    {id: 4, name: "Ibiza", brandName: "Seat", cylinder: 1000, power: 75, price: 14000},
    {id: 5, name: "Chiron", brandName: "Bugatti", cylinder: 8000, power: 1500, price: 2400000}
]
let idCars = 6

// ENDPOINTS

app.get('/', (req, res) => {
    res.render('index', {title: 'Cars&Brands'})
})

// GENERATE TABLES

app.get('/brands', (req, res) => {
    res.status(200).render('brands', {
        title: 'Marcas',
        brands: brands
    })
    res.status(404).send("ERROR")
})

app.get('/api/brands', (req, res) => {
    res.status(200).send(brands)
})

app.get('/cars', (req, res) => {
    res.status(200).render('cars', {
        title: 'Coches',
        cars: cars
    })
    res.status(404).send("ERROR")
})

app.get('/api/cars', (req, res) => {
    res.status(200).send(cars)
})

// INSERT BRANDS

app.get('/insert_brand', (req, res) => {
    res.status(200).render('insert_brand', {
        title: 'Insertar Marcas',
        brand: brands
    })
    res.status(404).send("ERROR: S'HA PRODUÏT UN ERROR")
})

//INSERT CARS

app.get('/insert_car', (req, res) => {
    res.status(200).render('insert_car', {
        title: 'Insertar Coches',
        cars: cars
    })
    res.status(404).send("ERROR: S'HA PRODUÏT UN ERROR")
})

// SEARCH SINGLE ELEMENT

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

// SEARCH CAR

app.get('/search_car', (req, res) => {
    try {
        const carId = parseInt(req.query.id)
        const car = searchElementById(carId, cars)
        res.status(200).render('single_car', {
            title: "Buscador de coches",
            car: car
        })
    } catch (error) {
        res.status(404).send("ERROR: COTXE NO TROBAT")
    }
})

// SEARCH BRAND

app.get('/search_brand', (req, res) => {
    try {
        const brandId = parseInt(req.query.id)
        const brand = searchElementById(brandId, brands)
        res.status(200).render('single_brand', {
            title: "Buscador de marcas",
            brand: brand
        })
    } catch (error) {
        res.status(404).send("ERROR: MARCA NO TROBADA")
    }
})

// SEARCH API

app.get('/api/search_brand/:id', (req, res) => {
    try {
        const brandId = parseInt(req.params.id);
        const brand = searchElementById(brandId, brands);
        res.status(200).send(brand)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
})
app.get('/api/search_car/:id', (req, res) => {
    try {
        const carId = parseInt(req.params.id);
        const car = searchElementById(carId, cars);
        res.status(200).send(car)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
});

// DELETE CARS

app.delete('/api/cars/:id', (req, res) => {
    const id = parseInt(req.params.id)
    let foundIndex = -1
    for (let i = 0; i < cars.length; i++) {
        if (cars[i].id === id) {
            foundIndex = i
            break;
        }
    }
    if (foundIndex === -1) {
        res.status(404).send('not found')
    } else {
        cars.splice(foundIndex, 1)
        res.status(204).send()
    }
})

// DELETE BRANDS

app.delete('/api/brands/:id', (req, res) => {
    const id = parseInt(req.params.id)
    let foundIndex = -1
    for (let i = 0; i < brands.length; i++) {
        if (brands[i].id === id) {
            foundIndex = i
            break;
        }
    }
    if (foundIndex === -1) {
        res.status(404).send('not found')
    } else {
        brands.splice(foundIndex, 1)
        res.status(204).send()
    }
})

// INSERT BRANDS

app.post('/api/insert_brand', (req, res) => {
    try {
        let params = req.body
        params.id = idBrands
        idBrands += 1
        brands.push(params)
        res.status(201).redirect('/brands')
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

// INSERT CARS

app.post('/api/insert_car', (req, res) => {
    try {
        let params = req.body;
        params.id = idCars;
        idCars += 1;
        cars.push(params);
        res.status(201).redirect('/cars');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

// UPDATE CAR

app.get('/update_car/:id', (req, res) => {
    const carId = req.params.id;
    const car = cars.find(car => car.id === parseInt(carId));
    if (!car) {
        return res.status(404).send('Car not found');
    }
    res.render('update_car.ejs', {
        title: 'Update Car', car: car
    });
});

app.post('/api/update_car/:id', (req, res) => {
    const carId = parseInt(req.params.id);
    const carIndex = cars.findIndex(car => car.id === carId);
    if (carIndex === -1) {
        return res.status(404).send('Car not found');
    }
    cars[carIndex] = {
        id: carId,
        name: req.body.name,
        brandName: req.body.brandName,
        cylinder: req.body.cylinder,
        power: req.body.power,
        price: req.body.price
    };

    res.status(200).redirect('/cars');
});

// UPDATE BRAND

app.get('/update_brand/:id', (req, res) => {
    const brandId = parseInt(req.params.id);
    const brand = brands.find(brand => brand.id === brandId)
    if (!brand) {
        return res.status(404).send('Brand not found');
    }
    res.render('update_brand.ejs', {
        title: 'Update Brand', brand: brand
    });
});

app.post('/api/update_brand/:id', (req, res) => {
    const brandId = parseInt(req.params.id);
    const brandIndex = brands.findIndex(brand => brand.id === brandId);
    if (brandIndex === -1) {
        return res.status(404).send('Brand not found');
    }

    brands[brandIndex] = {
        id: brandId,
        name: req.body.name,
        country: req.body.country,
        year: req.body.year,
        founder: req.body.founder,
        car: req.body.car
    };

    res.status(200).redirect('/brands');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
