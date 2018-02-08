const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

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
  // app.set('secretKey', require('./'))
} else {
  app.set('secretKey', 'mysecrets');
}

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'UFO-TRACKER';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}. env: ${environment}`);
});

const checkAuth = (request, response, next) => {
  const token = request.headers.token;

  if(!token) {
    return response.status(403).json({ error: 'You must be authorized to hit this endpoint.'});
  } else {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      console.log(decoded);
      if (error) {
        return response.status(403).json({ error: 'Please send a valid token.' });
      } 
      if (!decoded.data.admin) {
        return response.status(403).json({error: 'You are not an authorized user.'})
      }
    })
  }
  next();
};

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

app.get('/api/v1/sightings/location', async (request, response) => {
  const {city, state} = request.query;

  const locationID = await getLocationID(city, state, response);
  if (locationID === null) {
    return response.status(404).json({ error: `No sightings found for the location ${city}, ${state}`})
  }
  return database('sightings').where('location_id', locationID).select()
    .then(sightings => {
      if (!sightings.length) {
        return response.status(404).json({error: `No sightings found for location: ${city}, ${state}.`});
      }
      return response.status(200).json({sightings});
    })
    .catch(error => {
      return response.status(500).json({error: `Error getting sightings for location: ${city}, r${state}. ${error}`});
    });
});

const getLocationID = (city, state, response) => {
  return database('locations').where('city', city).andWhere('state', state).first()
    .then(location => {
      console.log(location.id);
      return location.id;
    })
    .catch(error => {
      return null;
    });
};

app.get('/api/v1/sightings/shape', async (request, response) => {
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

app.post('/api/v1/sightings', (request, response) => {
  const sighting = request.body;

  for (let requiredParameters of ['location_id', 'shape_id', 'duration', 'summary', 'reported_time']) {
    if (!sighting[requiredParameters]) {
      return response.status(422).json({error: `Missing required parameter ${requiredParameters}.`});
    }
  }

  return database('sightings').insert(sighting, 'id')
    .then(id => {
      return response.status(201).json({status: `Successfully added sighting (#${id}).`});
    })
    .catch(error => {
      return response.status(500).json({error: `Error adding sighting: ${error}.`});
    })
});

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

app.patch('/api/v1/sightings/:id/summary', checkAuth, (request, response) => {
  const { id } = request.params;
  const { summary } = request.body;

  if (!summary) {
    return response.status(422).json({error: `Error invalid summary: "${summary}".`});

  }

  return database('sightings').where('id', id).update('summary', summary)
    .then(updatedSighting => {
      return response.status(200).json({status: `Successfully updated summary of sighting #${id} to "${summary}".`});
    })
    .catch(error => {
      return response.status(500).json({error: `Error updating sighting. ${error}`});
    })
});

app.patch('/api/v1/sightings/:id/duration', checkAuth, (request, response) => {
  const { id } = request.params;
  const { duration } = request.body;

  if (!duration) {
    return response.status(422).json({error: `Error invalid duration: "${duration}".`});

  }

  return database('sightings').where('id', id).update('duration', duration)
    .then(durationResponse => {
      return response.status(200).json({ status: `Success updating duration: ${durationResponse}`})
    })
    .catch(error => {
      return response.status(500).json({error: `Error adding location: ${error}.`});
    })
});

app.delete('/api/v1/sightings/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  return database('sightings').where('id', id).del()
    .then(sightingID => {
      return response.status(200).json({ status: `Success deleting sighting ${id}: ${sightingID}`})
    })
    .catch((error) => {
      return response.status(500).json({error: `Error deleting sighting ${id}: ${error}.`});
    })
});

app.delete('/api/v1/sightings', async (request, response) => {
  const {city, state} = request.query;
  const locationID = await getLocationID(city, state, response);

  return database('sightings').where('location_id', locationID).del()
    .then(() => {
      response.status(200).json({status: `Successfully deleted all locations with id #${locationID}.`});
    })
    .catch(error => {
      return response.status(500).json({error: `Error deleting sightings with location id #${locationID}.`});
    });
});

app.post('/api/v1/authenticate', (request, response) => {
  const { email, appName } = request.body;
  
  const admin = email.endsWith('@turing.io');

  const generatedJWT = jwt.sign({
      expiresIn: '48h',
      data: { email, appName, admin }
    }, app.get('secretKey')
  );

  return response.status(200).json(generatedJWT);
});

/*
4 GETS
 -2 for all
  - shapes /api/v1/shapes/ √
  - locations /api/v1/locations/ √
 -2 for specific
  - specific shape(id) /api/v1/sightings?shape=TRAINGULAR √
  - specific location(id) /api/v1/sightings?city=Denver&?state=CO √
 -2 POST - (SECURE)
  - post a new sighting /api/v1/sightings/ √ 
  - post a new location /api/v1/locations/ √
 -2 PUT OR PATCH - (SECURE)
  - update a summary /api/v1/sightings/:id/ T √
  - update the duration /api/v1/sightings/:id/ √
 -2 DELETE - (SECURE)
  - delete a sighting /api/v1/sightings/:id/ √
  - delete all by location or shape /api/v1/sightings?city=Denver&?state=CO T √
*/

module.exports = app;