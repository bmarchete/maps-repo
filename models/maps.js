const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/test');

const MapsSchemma = new mongoose.Schema({

    place_id: {
        type: String,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
    }
});

module.exports = mongoose.model('Maps', MapsSchemma);
