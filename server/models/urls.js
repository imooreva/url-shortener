var mongoose = require('mongoose');

var Urls = mongoose.model('Urls', {
    url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    shortlink: {
        type: String,
        required: true,
        minlength: 1
    }
});

module.exports = {Urls};
