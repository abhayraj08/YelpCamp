const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = new Schema ({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;


// body = 'Wow it is great.'
// rating = 4