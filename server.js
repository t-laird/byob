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
      return response.status(200).json({ locations });
    })
    .catch(error => {
      return response.status(500).json({error: 'Error getting locations.'});
    });
});

app.get('/api/v1/sightings/', async (request, response) => {
  const { shape } = request.query;
  
  const shapeID = await getShapeID(shape, response);

  if(shapeID === null) {
    return response.status(404).json({ error: `No sightings found for the shape ${shape}`})
  }
  
  return database('sightings').where('shape_id', shapeID).select()
    .then(sightings => {
      if (!sightings.length) {
        return response.status(404).json({ error: `No sightings found for the shape ${shape}`})
      }

      return response.status(200).json({ sightings });
    })
    .catch(error => {
      return response.status(500).json({ error: `Error getting sightings for the shape ${shape}` });
    })
});

const getShapeID = (shape, response) => {
  return database('shapes').where('type', shape).first()
    .then(shape => {
      console.log(shape.id)
      return shape.id
    })
    .catch(error => {
      return null;
    });
};

app.post('/api/v1/locations/', (request, response) => {
  const location = request.body;
  
  location.count = 0;

  for (let requiredParameters of ['city', 'state']) {
    if (!location[requiredParameters]) {
      return response.status(422).json({error: `Missing required parameter ${requiredParameters}.`});
    }
  }

  return database('locations').insert(location, 'id')
    .then(id => {
      return response.status(201).json({status: `Success adding location: ${id}.`});
    })
    .catch(error => {
      return response.status(500).json({error: `Error adding location: ${error}.`});
    })
});

app.patch('/api/v1/sightings/:id', (request, response) => {
  const { id } = request.params;
  const { duration } = request.body;
  

  return database('sightings').where('id', id).update('duration', duration)
    .then(durationResponse => {
      return response.status(200).json({ status: `Success updating duration: ${durationResponse}`})
    })
    .catch(error => {
      return response.status(500).json({error: `Error adding location: ${error}.`});
    })
});

app.delete('/api/v1/sightings/:id', (request, response) => {
  const { id } = request.params;

  return database('sightings').where('id', id).del()
    .then(sightingID => {
      return response.status(200).json({ status: `Success deleting sighting ${id}: ${sightingID}`})
    })
    .catch((error) => {
      return response.status(500).json({error: `Error deleting sighting ${id}: ${error}.`});
    })
});

module.exports = app;
