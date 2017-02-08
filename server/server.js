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

app.get('/new/:id', (req, res) => {
    var newurl = new Urls({
        url: req.params.id,
        shortlink: Math.random().toString(36).substr(2, 6)
    });
    newurl.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/:id', (req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        //res.send({url});
        res.redirect(url[0].url);
    }, (e) => {
        res.status(400).send({error: 'shortened URL not found'});
    });

});

app.post('/add', (req, res) => {
    var newurl = new Urls({
        url: req.body.url,
        shortlink: Math.random().toString(36).substr(2, 6)
    });
    newurl.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

//app.get('/urls', (req,res) => {
//    Urls.find().then((urls) => {
//        res.send({urls});
//    }, (e) => {
//        res.status(400).send(e);
//    });
//});

module.exports = {app};
