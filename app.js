var express = require('express');
var app = express();
var request = require('request');
var port = process.env.PORT || 8080;

app.listen(port);
console.log('Server runs on port ' + port);

app.use(express.static('build'));

app.enable('trust proxy');

app.get('/weather', function(req, res) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&q=zaporizhya';

    request.post(url, function(err, response, body){
        res.send(body);
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