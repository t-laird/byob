const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);

const app = express();

const requireHTTPS = (request, response, next) => {
  if (request.headers['x-forwarded-proto'] !== 'https') {
    return response.redirect('https://' + request.get('host') + request.url);
  }
  next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'UFO-TRACKER';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


app.get('/api/v1/shapes/', (request, response) => {
  return database('shapes').select()
    .then(shapes => {
      return response.status(200).json({shapes});
    })
    .catch(error => {
      return response.status(500).json({error: 'Error getting shapes.'});
    });
});

app.get('/api/v1/locations/', (request, response) => {
  return database('locations').select()
    .then(locations => {
      return response.status(200).json({locations});
    })
    .catch(error => {
      return response.status(500).json({error: 'Error getting locations.'});
    });
});


/*
4 GETS
 -2 for all
  - shapes /api/v1/shapes/ √
  - locations /api/v1/locations/ √
 -2 for specific
  - specific shape(id) /api/v1/sightings?shape=TRAINGULAR J
  - specific location(id) /api/v1/sightings?city=Denver&?state=CO T
 -2 POST - (SECURE)
  - post a new sighting /api/v1/sightings/ T 
  - post a new location /api/v1/locations/ J
 -2 PUT OR PATCH - (SECURE)
  - update a summary /api/v1/sightings/:id/ T
  - update the duration /api/v1/sightings/:id/ J
 -2 DELETE - (SECURE)
  - delete a sighting /api/v1/sightings/:id/ J
  - delete all by location or shape /api/v1/sightings?city=Denver&?state=CO T
*/

module.exports = app;
