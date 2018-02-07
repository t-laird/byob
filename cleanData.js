const eventData = require('./ufo-sightings/events.js');
const fs = require('fs');

const cleanLocations = () => {
  const locations = eventData.reduce((allLocations, result) => {
    if (!allLocations[result.state]) {
      allLocations[result.state] = { cities: {} };
    }

    if (!allLocations[result.state].cities[result.city]) {
      allLocations[result.state].cities[result.city] = {count: 0};
    }
    allLocations[result.state].cities[result.city].count++;
    return allLocations;      
  }, {});
  
  const formatLocations = JSON.stringify(locations, null, 2);
  
  fs.writeFile('./ufo-sightings/locations.json', formatLocations, 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });
};

const cleanShapes = () => {
  const shapes = eventData.reduce((allShapes, result) => {
    if (!allShapes[result.shape]) {
      allShapes[result.shape] = {count: 0};
    }

    allShapes[result.shape].count++;

    return allShapes;
  }, {});

  const formatShapes = JSON.stringify(shapes, null, 2);

  fs.writeFile('./ufo-sightings/shapes.json', formatShapes, 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

cleanLocations();
cleanShapes();