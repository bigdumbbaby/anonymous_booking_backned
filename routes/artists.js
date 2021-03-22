const router = require('express').Router();

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

router.use(bodyParser.json())

router.get('/', (request, response) => {
  database('artist')
    .then(artists => response.send(artists))
})

router.get('/:id', (req, res) => {
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
          bcrypt.hash(artis.password, 12)
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