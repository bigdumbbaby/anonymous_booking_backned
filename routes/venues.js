const { default: knex } = require("knex");
const router = require("./artists");

router.get('/owner',()){
  knex('venues')
    .join()
}