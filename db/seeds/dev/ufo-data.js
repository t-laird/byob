const locations = require('../../../ufo-sightings/locations');
const shapes = require('../../../ufo-sightings/shapes');
const sightings = require('../../../ufo-sightings/events');

exports.seed = function(knex, Promise) {
  return knex('sightings').del()
    .then(() => knex('shapes').del())
    .then(() => knex('locations').del())

    .then(() => {
      return knex('shapes').insert(shapes);
    })
    .then(() => {
      return knex('locations').insert(locations);
    })
    .then(() => {
      let sightingsPromises = [];

      sightings.forEach((sighting) => {
        const shapeID = getShapeID(knex, sighting.shape);
        const locationID = getLocationID(knex, sighting.state, sighting.city);

        sightingsPromises.push(Promise.all([
          Promise.all([shapeID, locationID]), 
          Promise.resolve({
            summary: sighting.summary,
            duration: sighting.duration,
            reported_time: sighting.date
          })
        ]));

      });
      return Promise.all(sightingsPromises)
    })
    .then(promises => {
      let sightings = [];
      promises.forEach(promise => {
        sightings.push(
          knex('sightings').insert({
            shape_id: promise[0][0],
            location_id: promise[0][1],
            summary: promise[1].summary,
            duration: promise[1].duration,
            reported_time: promise[1].date
          })
        );
      });
      return Promise.all(sightings);
    })
    .catch(error => console.log('big error:', error))
};


const getShapeID = (knex, shape) => {
  return knex('shapes').where('type', shape).first('id')
    .then(({id}) => {
      return id;
    })
    .catch(error => console.log('error:', error));
}; 

const getLocationID = (knex, state, city) => {
  return knex('locations').where('state', state).andWhere('city', city).first('id')
    .then(({id}) => {
      return id;
    })
    .catch(error => console.log('error:', error));
};