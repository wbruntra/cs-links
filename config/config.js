const getConfig = () => {
  const { DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = process.env

  let dbConnection

  switch (process.env.NODE_ENV) {
    case 'local':
      dbConnection = `mariadb://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/${DB_NAME}`
      console.log('Connecting to: ', dbConnection)
      return {
        dbConnection,
      }
    default:
      return {
        dbConnection: `mariadb://${DB_USER}:${DB_PASSWORD}@127.0.0.1:3306/${DB_NAME}`,
      }
  }
}

module.exports = getConfig()
