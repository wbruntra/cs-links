require('dotenv').config()

module.exports = {
  development: {
    SECRET: 'hello',
    URL_BASE: 'http://localhost:3000',
  },
  testing: {
    SECRET: 'hello',
    URL_BASE: 'http://localhost:3401',
  },
  production: {
    SECRET: process.env.SECRET,
    URL_BASE: process.env.URL_BASE,
  },
}
