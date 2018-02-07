const locations = require('../../../ufo-sightings/locations');
const shapes = require('../../../ufo-sightings/shapes');
const sightings = require('../../../ufo-sightings/events');

exports.seed = function(knex, Promise) {
  return knex('sightings').del()
    .then(() => knex('shapes').del())
    .then(() => knex('locations').del())

    .then(() => {
      return knex('shapes').insert(shapes)
    })
    .then(() => {
      return knex('locations').insert(locations)
    })
    .then(() => {
      let sightingsPromises = [];

      sightings.forEach((sighting) => {
        getShapeAndLocationId(knex, sighting.shape, sighting.city, sighting.state)
        .then((shapeLocationIds) => {
          console.log(shapeLocationIds)
        })
        .catch(error => console.log('each error:', error))

        //  sightingsPromises.push(
        //  knex('sightings').insert({
        //     shape_id: shapeID,
        //     location_id: locationID,
        //     summary: sighting.summary,
        //     duration: sighting.duration,
        //     reported_time: sighting.date
        //   })
        // )
      })
      return Promise.all(sightingsPromises)
    })
    // .then( (sightings) => {
    //   console.log(sightings);
    // })
    .catch(error => console.log('big error:', error))
};


const getShapeAndLocationId = (knex, shape, state, city) => {

  const id = knex('shapes').where('type', shape).select('id')
    .then((shapeID) => {
      console.log('shapeID:', shapeID)
      return shapeID;
    })
    // .then(shapeID => {
    //   return knex('locations').where('state', state).andWhere('city', city).select('id')
    //     .then(locationID => {
    //       console.log(locationID[0].id, shapeID);
    //       return {location_id: locationID[0].id, shape_id: shapeID};
    //     })
    // })
    .catch(error => console.log('error:', error))
    return id;
}; 

// const getLocationID = (knex, state, city) => {
//   return knex('locations').where('state', state).andWhere('city', city).select('id')
//     .then((locationID) => {
//       return locationID[0].id;
//     })
// }