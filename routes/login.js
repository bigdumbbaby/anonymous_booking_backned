const router = require('express').Router();

const knex = require('knex')
const config = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = knex(config)

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.use(bodyParser.json())

router.post('/', (request, response) => {
  const { owner } = request.body
  console.log(owner)
  database('owner')
    .select()
    .where({ username: owner.username})
    .first()
    .then(retrievedUser => {
      if(!retrievedUser) throw new Error("No User!")
      return Promise.all([
        bcrypt.compare(owner.password, retrievedUser.password_hash),
        Promise.resolve(retrievedUser),
      ])
    }).then(results => {
      const arePasswordsTheSame = results[0]
      const owner = results[1]
      if(!arePasswordsTheSame) throw new Error("Wrong password!")

      const payload = {username: owner.username}
      // const secret = "QUIET"
      const secret = process.env.SECRET

      jwt.sign(payload, secret, (error, token) => {
        if (error) throw new Error("Signing didn't work")

        response.json({ token })
      })
    })
    .catch(error => {
      response.json(error.message)
    })
})

module.exports = router;