var express = require('express');
var app = express();
var request = require('request');
var RSVP = require('rsvp');

app.listen(8080);

app.use(express.static('build'));

app.enable('trust proxy');

app.get('/weather', function(req, res) {
    return new RSVP.Promise(function (resolve, reject) {
        request('http://ipinfo.io', function (err, response, body) {
            var str = JSON.parse(body).loc,
                lat = str.substring(0, str.indexOf(',')),
                lon = str.substring(str.indexOf(',') + 1);
            var coords = {
                lat: lat,
                lon: lon
            };
            resolve(coords);
        });
    })
        .then(function (coords) {
            var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + coords.lat + '&lon=' + coords.lon;

            request.post(url, function(err, response, body){
                res.send(body);
            });
        });
});

app.get('/weather/target', function(req, res) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + req.query.lat + '&lon=' + req.query.lon;

    request(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            res.send(body);
        } else {
            throw new Error('The error has occured: ' + err);
        }
    });
});