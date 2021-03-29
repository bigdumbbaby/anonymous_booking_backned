const router = require('express').Router();
const auth = require('../utility/authenticate')

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const { route } = require('./owners');

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

router.post('/getMyConnections', (request, response) => {
  const { my_id } = request.body
  database('connection')
    .select()
    .where({ owner_id: my_id })
    .then(output => {
      let artists = []
      // response.json(output)
      output.map(connection => {
        database('artist')
          .select()
          .where({id: connection.artist_id})
          .then(output => {
            console.log(output)
            artists = output
          })
      })
      response.json({connections: output, artists: artists})
    }).catch(error => {
      response.json({ error: error.messgae })
    })
})

module.exports = router;