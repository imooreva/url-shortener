const express = require('express');
const port = process.env.PORT || 3000; //port used for Heroku, otherwise 3000

const {mongoose} = require('./db/mongoose.js');
const {Urls} = require('./models/urls.js');
const {validateURL, createNewURL} = require('./functions.js');

var app = express();
app.use(express.static('./public'));
app.listen(port, () => console.log(`Started up on port ${port}`));

app.get('/new/:url*', (req, res) => {
    let slicedURL = req.url.slice(5);
    if (!validateURL(slicedURL)) {
        return res.status(400).send({error: "Invalid URL"});
    }
    createNewURL(slicedURL).save().then((doc) => {
        res.send({
            url: doc.url,
            shortlink: doc.shortlink
        });
    }).catch((e) => {
        res.status(500).send(e);
    });
});

app.get('/:id', (req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        let redirecturl = url[0].url;
        //console.log('Redirect to:', redirecturl);
        res.redirect(redirecturl);
    }).catch((e) => {
        res.status(404).send({error: 'shortened URL ID not found'});
    });

});

module.exports = {app};