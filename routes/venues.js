const router = require('express').Router();
const auth = require('../utility/authenticate')

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

router.use(bodyParser.json())

router.get('/', (request, response) => {
  database('venue')
    .then(venues => response.send(venues))
})

router.post('/', (request, response) => {
  const { venue } = request.body
  if(venue.name === "" || 
  venue.address === "" || 
  venue.city === "" || 
  venue.state === "" || 
  venue.zip === ""){
    response.json({ message: "Insufficient information" })
  } else {
    database('venue')
    .insert({
      name: venue.name,
      owner_id: venue.owner_id,
      address: venuer.address,
      city: venuer.city,
      state: venuer.state,
      zip: venue.zip,
      type: venue.type,
    })
    .returning('*')
    .then((owners) => {
      const venue = owners[0]

      response.json({ venue })
    })
    .catch(error => {
      response.json({ error: error.messgae })
    })
  }
})

module.exports = router;