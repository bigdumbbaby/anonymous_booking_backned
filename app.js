const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

// const knex = require('knex')
// const config = require('./knexfile')[process.env.NODE_ENV || 'development']
// const database = knex(config)

const ownerRouter = require('./routes/owners')
const loginRouter = require('./routes/login')
const secretRouter = require('./routes/secret-route')
const artistRouter = require('./routes/artists')
const venueRouter = require('./routes/venues')
const connectionRouter = require('./routes/connections')

app.use(cors())
app.use(express.json())

app.use('/owners', ownerRouter)
app.use('/login', loginRouter)
app.use('/secretRoute', secretRouter)
app.use('/artists', artistRouter)
app.use('/venues', venueRouter)
app.use('/connections', connectionRouter)

app.listen(port, () => {
  console.log(`LISTENING ON PORT ${port}`)
})