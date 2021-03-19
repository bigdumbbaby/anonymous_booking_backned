const router = require('express').Router();

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.use(bodyParser.json())

router.get('/', authenticate, (request, response) => {
  response.json({ message: `${request.owner.username} found me`})
})

function authenticate(request, response, next){
  const authHeader = request.get("Authorization")
  const token = authHeader.split(" ")[1]
  // const secret = "QUIET"
  const secret = process.env.SECRET

  jwt.verify(token, secret, (error, payload) => {
    if (error) response.json({ error: error.message})
    database('owner')
      .select()
      .where({ username: payload.username })
      .first()
      .then( owner => {
        request.owner = owner
        next()
      }).catch(error => {
        response.json({ error: error.message})
      })
  }) 
}

module.exports = router;