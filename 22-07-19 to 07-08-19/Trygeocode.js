var NodeGeocoder = require('node-geocoder');

var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '8f1210175c204ffc9c7bce586508e231'
});

// Using callback
geocoder.geocode('37.4396, -122.1864', function(err, res) {
  //console.log(res);
});
geocoder.geocode('29 champs elysée paris', function(err, res) {
  console.log(res);
});
/*
// Or using Promise
//geocoder.geocode('37.4396, -122.1864')
//.then(function(res) {
//  console.log(res);
//})
//.catch(function(err) {
//  console.log(err);
//});
*/
/**
 * An express application which serves root route and provides an API to get current ISS coordinates in GeoJSON format.
 */
/*
var request = require('request'),
    geojson = require('geojson'),
    express = require('express'),
    path = require('path');

var ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/findiss', function (req, res) {
    request(ISS_URL, function (err, resp, body) {
        if (err) {
            console.log(err);
            res.status(400).json({error: 'Unable to contact ISS API'});
            return;
        }

        var apiResponse = JSON.parse(body);
        var issGeoJSON = geojson.parse([apiResponse], {Point: ['latitude', 'longitude']});

        res.json(issGeoJSON);
    });
});

app.listen(app.get('port'), function () {
    console.log("App listening on port " + app.get('port'));
});
*/
