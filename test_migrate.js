const environment = 'testing'
const knexfile = require('./knexfile')
const db = require('knex')(knexfile[environment])

const run = async () => {
  console.log('Running migrations...')
  try {
    await db.migrate.latest()
    console.log('Migrations run!')
    await db('links').insert({
      code: 'abcde',
      address: 'http://hello.com',
    })
    const link = await db('links').first()
    console.log(link)
  } catch (e) {
    console.log(e)
  }
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
