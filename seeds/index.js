// This file runs separately to seed data into database.

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/600/400',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores esse quod enim nulla excepturi, vero facere quam natus dolores molestias ratione in inventore blanditiis incidunt, distinctio cum error, nam fuga sit adipisci provident. Cum voluptas animi repellat alias omnis molestiae culpa qui distinctio. In non modi dolore sapiente similique reprehenderit!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})