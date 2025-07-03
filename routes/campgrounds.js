const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// home page
router.get('/', catchAsync(campgrounds.index));

// create (go to page)
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// create (new data into database)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// read
router.get('/:id', catchAsync(campgrounds.showCampground));

// update (go to page)
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// update (updated data into database)
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;