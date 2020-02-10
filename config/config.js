const getConfig = () => {
  const { DB_NAME, DB_PASSWORD, DB_USER, DB_PORT } = process.env

  let dbConnection;
  
  switch (process.env.NODE_ENV) {
    case 'local':
      dbConnection = `mariadb://root:devpw@127.0.0.1:${DB_PORT}/cslinks`
      console.log(dbConnection)
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
