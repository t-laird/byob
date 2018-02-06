exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations', (table) => {
    table.increments('id').primary();
    table.string('city');
    table.string('state');
    table.integer('count');    
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('locations');
};
