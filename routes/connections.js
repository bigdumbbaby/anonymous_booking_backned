const router = require('express').Router();
const auth = require('../utility/authenticate')

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

router.use(bodyParser.json())

router.get('/', auth, (request, response) => {
  database('connection')
    .then(owners => response.send(owners))
})

router.post('/', auth, (request, response) => {
  const { connection } = request.body
  if(!connection.owner_id || 
    !connection.artist_id ||
    connection.message === ""){
    response.json({ message: "Insufficient information" })
  } else {
    database('connection')
    .insert({
      owner_id: connection.owner_id,
      artist_id: connection.artist_id,
      message: connection.message,
      link: connection.link,
      is_approved: connection.is_approved,

    })
    .returning('*')
    .then((connections) => {
      const connectionReturn = connections[0]
      response.json({connectionReturn})
    })
    .catch(error => {
      response.json({ error: error.message })
    })
  }
})

module.exports = router;