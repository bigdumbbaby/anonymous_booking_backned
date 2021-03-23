
exports.up = function(knex) {
  return knex.schema.createTable('venue', (t) => {
    t.increments('id')
    t.string('name')
    t.integer('owner_id').references('id').inTable('owner')
    t.string('address')
    t.string('city')
    t.string('state')
    t.integer('zip')
    t.string('type')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('venue')
};
