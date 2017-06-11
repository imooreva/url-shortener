var express = require('express');
//var helmet = require('helmet');
var path = require('path');

//configure express app and start listening
var app = express();
const PATH = path.join(__dirname, '../public');

//app.use(helmet());
app.use(express.static(PATH));
app.use(require('./routes-api.js'));

const PORT = process.env.PORT || 3000; //port used for Heroku, otherwise 3000
if (!module.parent) { app.listen(PORT, () => console.log(`Started up on port ${PORT}`)) }; //conditional statement prevents EADDRINUSE error when running mocha/supertest

module.exports = {app};
