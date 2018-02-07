
exports.seed = function(knex, Promise) {
  return knex('sightings').del()
    .then(() => knex('shapes').del())
    .then(() => knex('locations').del())

    .then(function () {
      return Promise.all([
        knex('shapes').insert({
          type:
          shape:
        }, 'id')
        .then(() => {
          
        })
      ])
    });
};
