
exports.up = function(knex, Promise) {
  return knex.schema.createTable('shapes', (table) => {
    table.increments('id').primary();
    table.string('type');
    table.integer('count').unsigned();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('shapes');
};
