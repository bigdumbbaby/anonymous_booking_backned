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
  console.log(request.body)
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

router.put('/:id', (request,response) => {
  database('connection')
    .where({id: request.params.id})
    .update({is_approved: true})
    .returning('*')
    .then(data => {
      // response.json(data)
      return database('artist')
        .select()
        .where({id: connection.artist_id})
        .then(artist => {
          return {
            ...data,
              artist
          }
        })
    })
})

router.post('/checkForConnection', (request, response) => {
  const {owner_id, artist_id} = request.body
  database('connection')
    .select()
    .where({owner_id: owner_id, artist_id: artist_id})
    .then(output => {
      if(output.length > 0){
        response.json(output)
      } else {
        response.json(false)
      }
    })
})

router.post('/getMyConnections', (request, response) => {
  const { my_id } = request.body
  database('connection')
    .select()
    .where({ owner_id: my_id })
    .then(output => {
      return Promise.all(output.map(connection => {
        return database('artist')
          .select()
          .where({id: connection.artist_id})
          .then(artist => {
            return {
              ...connection, 
              artist
            }
          })
      }))
      .then((connections) => {
        response.json(connections)
      })
    })
})

module.exports = router;