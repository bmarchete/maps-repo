const restify = require("restify");
var fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('<YOUR_MONGODB_CONNECTION>');
require('./models/maps')

const googleMapsClient = require('@google/maps').createClient({
  key: '<YOUR_MAPS_APIKEY>',
  Promise: Promise
});

const server = restify.createServer({
  name: "myapp",
  version: "1.0.0",

});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get("/all", function (req, res, next) {
  mongoose.model('Maps').find().then((docs) => {
    console.log(docs);
    res.send(docs)
  }, next)
  //return next();
});

server.post("/geocode", function (req, res, next) {
  const { lat, lng } = req.body

  googleMapsClient.reverseGeocode({ latlng: [lat, lng] }).asPromise()
    .then((response) => {
      const address = response.json.results[0].formatted_address
      const place_id = response.json.results[0].place_id;
      const image = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=300x300&sensor=false&key=<YOUR_MAPS_APIKEY>`;

      var Map = mongoose.model('Maps');
      var map = new Map({ place_id, address, image });
      map.save().then((result) => {
        console.log(result);
        res.send(result)
      }, next)


    })
    .catch((err) => {
      res.send(err);
    });

});

server.get(/\/(.*)?.*/, restify.plugins.serveStatic({
  directory: './dist',
  default: 'index.html',
}));

server.listen(8080, function () {
  console.log("%s listening at %s", server.name, server.url);
});