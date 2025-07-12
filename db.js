require('dotenv').config()
const knexfile = require('./knexfile')
console.log(`NODE_ENV = ${process.env.NODE_ENV}`)
const config = knexfile[process.env.NODE_ENV]

console.log(`Using knex config: ${JSON.stringify(config, null, 2)}`)

const knex = require('knex')(config)

module.exports = knex
