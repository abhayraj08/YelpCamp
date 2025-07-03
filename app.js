const express = require('express');
const port = 3030;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); // To use PUT & DELETE req
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// routers
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))


const app = express();

// Set up EJS as the templating engine with ejs-mate for layout support
// Configure the view engine to use EJS and set the directory for views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(express.urlencoded({ extended: true }));  // To use of req.body
app.use(methodOverride('_method'));               // To use PUT, DELETE req
app.use(express.static(path.join(__dirname, 'public')));  // To use statics file (css, js)

// session middleware
const sessionConfig = {
    secret: 'thisshouldbebettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash()); 

// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash card middlewares
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
 
// campground and review routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// dummy file
app.get('/', (req, res) => {
    res.render('home');
})

// This route triggers if no other route was matched
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


// Error handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})

// Starting server
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})     