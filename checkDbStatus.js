const db = require('./db')

const checkDbStatus = async (tablename) => {
  try {
    console.log(tablename)
    const results = await db(tablename).select().limit(1)
    console.log(results)
    return true
  } catch (e) {
    console.log('error')
    console.log(e)
    return false
  }
}

const run = () => {
  const tablename = 'links'
  checkDbStatus(tablename)
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

run()

module.exports = checkDbStatus
