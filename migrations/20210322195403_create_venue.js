
exports.up = function(knex) {
  return knex.schema.createTable('venue', (t) => {
    t.increments('id')
    t.string('name')
    t.foreign('owner_id').references()
    t.string('password_hash')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('venue')
  
};
