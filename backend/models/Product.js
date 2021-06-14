const mongoose = require('mongoose');
const User = require('../models/User')

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter price'],
        maxLength: [5, 'Price name cannot exceed 6 characters'],
        default: 0.0
    },    
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: {
            values: [
                'Hot Sauce',
                'Other Sauce',
                'Marinade',
                'BBQ Sauce',
                'Snacks',
                'Seasonings'
            ],
            message: 'Please select correct categories'
        }
    },
    heat: {
        type: String,
        required: [true, 'Please select a category'],
        enum: {
            values: [
                'XXXTRA HOT',
                'Hot',
                'Medium',
                'Mild',
                'None',
            ],
            message: 'Please select correct heat'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter a Seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product stock cannot be more than 5 digits'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', Product);