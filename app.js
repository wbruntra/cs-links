require('dotenv').config()
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var helmet = require('helmet')
var rateLimit = require('express-rate-limit')

var app = express()

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

var indexRouter = require('./routes/index')
const { logSuspiciousActivity } = require('./routes/monitoring')

// Suspicious activity logging
app.use(logSuspiciousActivity)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

if (process.env.NODE_ENV !== 'testing') {
  app.use(logger('dev'))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

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
  res.render('error')
})

module.exports = app
