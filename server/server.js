const express = require('express');
const port = process.env.PORT || 3000; //port used for Heroku, otherwise 3000

//external functions and URL schema/model
const {mongoose} = require('./db/mongoose.js');
const {Urls} = require('./models/urls.js');
const {validateURL, createNewURL} = require('./functions.js');

var app = express();
app.use(express.static('./public'));
if (!module.parent) { app.listen(port, () => console.log(`Started up on port ${port}`)) };

app.get('/new/:url*', (req, res) => {
    //trims "/new/" from req.url, then validates
    let slicedURL = req.url.slice(5);
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
app.get('/:id', (req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        let redirecturl = url[0].url;
        res.redirect(redirecturl);
    }).catch((e) => {
        res.status(404).send({error: 'Shortened URL ID not found'});
    });
});

module.exports = {app};