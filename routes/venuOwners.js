const router = require('express').Router();

const config = require('../knexfile')['development']
const kenx = require('knex')(config)

router.get('/', (req, res) => {
  res.send("list of venu owners goes here")
})

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    name: 'death',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/ALLIETTE_1.jpg/120px-ALLIETTE_1.jpg'
  })
})

router.post('/', (req, res) => {
  console.log('posting to cards')
})

module.exports = router;