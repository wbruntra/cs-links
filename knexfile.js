require('dotenv').config()

module.exports = {
  testing: {
    client: 'mysql2',
    connection: {
      database: 'cslinks_test',
      user: 'root',
      password: 'devpw',
      port: '3408',
    },
    pool: {
      min: 2,
      max: 10,
    },
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
    client: 'mysql2',
    connection: {
      database: 'cslinks',
      user: 'root',
      password: 'devpw',
      port: '3307',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
