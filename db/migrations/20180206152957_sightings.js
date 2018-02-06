exports.up = function(knex, Promise) {
  return knex.schema.createTable('sightings', (table) => {
    table.increments('id').primary();
    table.integer('shape_id').unsigned();
    table.foreign('shape_id').references('shapes.id');
    table.integer('location_id').unsigned();
    table.foreign('location_id').references('locations.id');
    table.string('summary');
    table.string('duration');
    table.string('reported_time');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sightings');
};
