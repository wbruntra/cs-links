require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const app = express()

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const createLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 link creations per windowMs
  message: 'Too many links created from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)
app.use('/cli', createLinkLimiter)
app.use('/link', createLinkLimiter)

const indexRouter = require('./routes/index')
const { logSuspiciousActivity } = require('./routes/monitoring')

// Suspicious activity logging
app.use(logSuspiciousActivity)

if (process.env.NODE_ENV !== 'testing') {
  app.use(logger('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send({ error: 'error' })
})

module.exports = app
