const router = require('express').Router();
const auth = require('../utility/authenticate')

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

router.use(bodyParser.json())


router.get('/', auth, (request, response) => {
  database('owner')
    .then(owners => response.send(owners))
})

router.get('/:id', (req, res) => {
})

router.post('/', (request, response) => {
  const { owner } = request.body
  if(owner.username === "" || owner.password === ""){
    response.json({ message: "needs username and password" })
  } else {
    database('owner')
      .select()
      .where({ username: owner.username})
      .first()
      .then(retrievedUser => {
        if(retrievedUser){
          response.json({ message: "user already exists" })
        } else {
          bcrypt.hash(owner.password, 12)
          .then(hashedPassword => {
            return database('owner')
              .insert({
                username: owner.username,
                email: owner.email,
                password_hash: hashedPassword,
              }).returning('*')
            })
            .then((owners) => {
              const owner = owners[0]
        
              response.json({ owner })
            }).catch(error => {
              response.json({ error: error.messgae })
            })
        }
      })
  }
})

router.post('/addVenueId', (request, response) => {
  const { owner, venue_id } = request.body
  if(venue_id){
    database('owner')
      .select()
      .where({ username: owner.username })
      .update({
        venue_id: venue_id
      })
      .returning('*')
      .then(user => {
        response.json(user)
      })
    } else {
      response.json({ error: "need venue id" })
    }
})

module.exports = router;
