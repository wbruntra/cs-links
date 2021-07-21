const axios = require('axios')
const knexfile = require('./knexfile')
const db = require('knex')(knexfile[process.env.NODE_ENV])
const keys = require('./keys')[process.env.NODE_ENV]
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const resetDatabase = async () => {
  return db.migrate
    .rollback()
    .then(() => {
      return db.migrate.latest()
    })
    .catch(() => {
      console.log('Error running migrations')
    })
}

const getAllLinks = async () => {
  const { URL_BASE, SECRET } = keys
  const links = await axios.get(`${URL_BASE}/links/${SECRET}`)
  console.log(links.data)
}

const run = async () => {
  await resetDatabase()
  console.log('Migrations run!')
  await db('links').insert({
    code: 'abcde',
    address: 'http://hello.com',
  })
  // const link = await db('links').first()
  // console.log(link)
  await getAllLinks()
  // const r = await axios.post(url, {
  //   address: site,
  // })
  // const r = await axios.get(url + `/k/zvnIcvsD3`)

  // console.log(r.data)
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
