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

app.get('/:id', (req, res) => {
    Urls.find({
        urlkey: req.params.id
    }).then((url) => {
        res.send({url});
    }, (e) => {
        res.status(400).send(e);
    });
    
});


app.get('/urls', (req,res) => {
    Urls.find().then((urls) => {
        res.send({urls});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/add', (req, res) => {
    var newurl = new Urls({
        url: req.body.url,
        urlkey: req.body.urlkey || Math.floor((Math.random() * 100000) + 1)
    });
    newurl.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

module.exports = {app};
