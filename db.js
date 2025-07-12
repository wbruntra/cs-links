require('dotenv').config()
const knexfile = require('./knexfile')
console.log(`NODE_ENV = ${process.env.NODE_ENV}`)
const knex = require('knex')(knexfile[process.env.NODE_ENV])

module.exports = knex
