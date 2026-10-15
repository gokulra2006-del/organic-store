const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.Mixed, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.Mixed, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);