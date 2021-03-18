const express = require('express')
const app = express()
port = process.env.PORT || 80

// const knex = require('knex')
// const config = require('./knexfile')[process.env.NODE_ENV || 'development']
// const database = knex(config)

const ownerRouter = require('./routes/owners')
const loginRouter = require('./routes/login')
const secretRouter = require('./routes/secret-route')

app.use('/owners', ownerRouter)
app.use('/login', loginRouter)
app.use('/secret-route', secretRouter)

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`)
})