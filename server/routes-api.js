var express = require('express');
var router = express.Router();

//URL schema/model and external functions
var {mongoose} = require('./db/mongoose.js');
var {Urls} = require('./models/urls.js');
var {validateURL, createNewURL} = require('./functions.js');

//route for new shortened URL
router.route('/api/new/:url*').get((req, res) => {
    //trims "/api/new/" from req.url, then validate with validateURL()
    let slicedURL = req.url.slice(9);
    if (!validateURL(slicedURL)) {
        return res.status(400).send({error: 'Invalid URL'});
    }
    //create and save new URL to mongoDB
    createNewURL(slicedURL).save().then((doc) => {
        res.send({
            url: doc.url,
            shortlink: doc.shortlink
        });
    }).catch((e) => {
        res.status(500).send(e);
    });
});

//search for shortened URL ID in database, then redirect user if shortened URL ID is found
//if not found, send JSON response with error
router.route('/api/:id').get((req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        let redirecturl = url[0].url;
        res.redirect(redirecturl);
    }).catch((e) => {
        res.status(404).send({error: 'Shortened URL ID not found'});
    });
});

//handle console error by sending 'No Content' 204 status
router.route('/favicon.ico').get((req, res) => res.sendStatus(204));

module.exports = router;
