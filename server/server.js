const bodyParser = require('body-parser');
const express = require('express');
const {ObjectID} = require('mongodb');
const port = process.env.PORT || 3000; //port used for Heroku, otherwise 3000

var {mongoose} = require('./db/mongoose.js');
var {Urls} = require('./models/urls.js');

var app = express();
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

app.get('/new/:url*', (req, res) => {
    if (!validateURL(req.url.slice(5))) {
        return res.status(400).send({error: "Invalid URL"});
    }
    var newurl = new Urls({
        url: req.url.slice(5),
        shortlink: Math.random().toString(36).substr(2, 6)
    });
    newurl.save().then((doc) => {
        res.send({
            url: doc.url,
            shortlink: doc.shortlink
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/:id', (req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        let redirecturl = url[0].url;
        //console.log(redirecturl);
        res.redirect(redirecturl);
    }, (e) => {
        res.status(404).send({error: 'shortened URL ID not found'});
    });

});

const validateURL =(url)=> {
    // regex source: https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
};

module.exports = {app};