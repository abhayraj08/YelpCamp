// This file runs separately to seed data into database.

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/YelpCamp';
mongoose.connect(dbUrl)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // YOUR USER ID
            author: '68613fafdd5adae29cfab325',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://picsum.photos/600/400',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores esse quod enim nulla excepturi, vero facere quam natus dolores molestias ratione in inventore blanditiis incidunt, distinctio cum error, nam fuga sit adipisci provident. Cum voluptas animi repellat alias omnis molestiae culpa qui distinctio. In non modi dolore sapiente similique reprehenderit!',
            price,
            geometry: { 
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhrujpm4m/image/upload/v1752838111/YelpCamp/hkae5cxhyne5gyehzd1o.png',
                    filename: 'YelpCamp/hkae5cxhyne5gyehzd1o',
                },
                {
                    url: 'https://res.cloudinary.com/dhrujpm4m/image/upload/v1751890746/YelpCamp/evkzursottcxjhukbgvx.jpg',
                    filename: 'YelpCamp/evkzursottcxjhukbgvx',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})