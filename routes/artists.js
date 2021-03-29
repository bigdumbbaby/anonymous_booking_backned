const router = require('express').Router();
const auth = require('../utility/authenticate')

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const { response } = require('express');

router.use(bodyParser.json())

router.get('/', auth, (request, response) => {
  database('artist')
    .then(artists => response.send(artists))
})

router.get('/:id', (req, res) => {
  response.json(this.param({id}))
  // database('artist')
  //   .select()
  //   .where({id: this.param(id)})
  //   .then(retrievedArtist => {
  //     response
  //   })
})

router.post('/', (request, response) => {
  const { artist } = request.body
  if(artist.username === "" || artist.password === ""){
    response.json({ message: "needs username and password" })
  } else {
    database('artist')
      .select()
      .where({ username: artist.username})
      .first()
      .then(retrievedUser => {
        if(retrievedUser){
          response.json({ message: "user already exists" })
        } else {
          bcrypt.hash(artist.password, 12)
          .then(hashedPassword => {
            return database('artist')
              .insert({
                username: artist.username,
                email: artist.email,
                password_hash: hashedPassword,
              }).returning('*')
            })
            .then((artists) => {
              const artist = artists[0]
        
              response.json({ artist })
            }).catch(error => {
              response.json({ error: error.messgae })
            })
        }
      })
  }
})

module.exports = router;