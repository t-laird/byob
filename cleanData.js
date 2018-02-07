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
  
  fs.writeFile('./ufo-sightings/locations.js', formatLocations, 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });
};
  
const cleanShapes = () => {
  const shapes = eventData.reduce((allShapes, result) => {
    const shapeIndex = allShapes.findIndex(shape => shape.type === result.shape);
    if (shapeIndex < 0) {
      allShapes.push({ type: result.shape ,count: 1 });
    } else {
      allShapes[shapeIndex].count++;
    }
    return allShapes;
  }, []);

  const formatShapes = JSON.stringify(shapes, null, 2);

  fs.writeFile('./ufo-sightings/shapes.js', formatShapes, 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  });
}

// cleanLocations();
cleanShapes();