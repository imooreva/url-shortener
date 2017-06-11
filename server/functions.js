var {Urls} = require('./models/urls.js');

var validateURL = url => {
    // regex source: https://gist.github.com/dperini/729294
    let regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
};

var createNewURL = (req, res) => {
    //trims "/api/new/" from req.url, then validate with validateURL()
    let slicedURL = req.url.slice(9);
    if (!validateURL(slicedURL)) {
        return res.status(400).send({error: 'Invalid URL'});
    }
    //Search for existing URL in database and send if query returns result
    //If nothing returned, create and save new shortened URL document
    Urls.findOne({
        url: slicedURL
    }, (err, result) => {
        if (err) {
            return console.log(err);
        }
        if (result) {
            return res.status(200).send(result);
        } else {
            let newURL = new Urls({
                url: slicedURL,
                shortlink: Math.random().toString(36).substr(2, 6)
            });
            newURL.save((err) => {
                if (err) {
                    return console.log(err);
                }
                res.status(200).send(newURL);
            });
        }
    });
};

var fetchURL = (req, res) => {
    Urls.find({
        shortlink: req.params.id
    }).then((url) => {
        let redirecturl = url[0].url;
        res.redirect(redirecturl);
    }).catch((e) => {
        res.status(404).send({error: 'Shortened URL ID not found'});
    });
};

module.exports = {validateURL, createNewURL, fetchURL};
