var mongoose = require('mongoose');

var Urls = mongoose.model('Urls', {
    url: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    urlkey: {
        type: Number,
        default: null
    }
});

module.exports = {Urls};
