const express = require('express');
const port = 3030;
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override'); // To use PUT, DELETE req
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema} = require('./schemas');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.urlencoded({ extended: true }));  // To use of req.body
app.use(methodOverride('_method'));               // To use PUT, DELETE req

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// dummy file
app.get('/', (req, res) => {
    res.render('home');
})

// home page
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// create (go to page)
app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

// create (new data into database)
app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// read
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}))

// update (go to page)
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

// update (updated data into database)
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

// delete
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect(`/campgrounds`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', {err});
})


app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})     