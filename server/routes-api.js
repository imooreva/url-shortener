var express = require('express');
var router = express.Router();
var http = require('http');

//URL schema/model and external functions
var {mongoose} = require('./db/mongoose.js');
var {Urls} = require('./models/urls.js');
var {validateURL, createNewURL, fetchURL} = require('./functions.js');

//route for new shortened URL
router.route('/api/new/:url*').get(createNewURL);

//search for shortened URL ID in database, then redirect user if shortened URL ID is found
//if not found, send JSON response with error
router.route('/api/:id').get(fetchURL);

//routes for forms
router.route('/new').get((req, res) => res.redirect(`/api/new/${req.query.url}`));
router.route('/get').get((req, res) => res.redirect(`/api/${req.query.shortened}`));

//handle console error by sending 'No Content' 204 status
router.route('/favicon.ico').get((req, res) => res.sendStatus(204));

module.exports = router;
