/*
const mockShapes = require('../../sdljf');
const mockLocations = require('../../sdljf');
const mockSightings = require('../../sdljf');
*/


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('sightings').del()
    .then(() => {
      return knex('shapes').del();
    })
    .then(() => {
      return knex('locations').del();
    })
    .then(() => {
      return Promise.all([
        knex('shapes').insert(mockShapes).returning('id'),
        knex('locations').insert(mockLocations).returning('id')
      ]);
    })
    .then(validIds => {
      return knex('sightings').insert(
        mockSightings.map( sighting => 
          ({
            location_id: validIds[0][0],
            shape_id: validIds[1][0],
            duration: sighting.duration,
            summary: sighting.summary,
            reported_time: sighting.date
          })
        )
      )
    })
    .then(() => {
      console.log('Seeded test data.');
    });
};
