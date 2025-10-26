const path = require('path')

module.exports = {
  testing: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'cslinks-test.sqlite3'),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  docker: {
    client: 'mysql2',
    connection: {
      host: 'cs_links_db',
      database: 'cslinks_test',
      user: 'root',
      password: 'devpw',
      port: '3306',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'cslinks-dev.sqlite3'),
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'cslinks-prod.sqlite3'),
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    useNullAsDefault: true,
  },
}
