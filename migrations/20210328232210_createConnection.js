
exports.up = function(knex) {
  return knex.schema.createTable('connection', (t) => {
    t.increments('id')
    t.integer('owner_id').references('id').inTable('owner')
    t.integer('artist_id').references('id').inTable('owner')
    t.string('message')
    t.string('link')
    t.boolean('is_approved')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('connection')
};
