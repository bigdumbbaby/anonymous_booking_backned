
exports.up = function(knex) {
  return knex.schema.createTable('artist', (t) => {
    t.increments('id')
    t.string('username')
    t.string('email')
    t.string('password_hash')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('artist')
};
