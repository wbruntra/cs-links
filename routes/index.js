var express = require('express')
var router = express.Router()
var randomstring = require('randomstring')

var Link = require('../models/Link')
// var sequelize = require('sequelize')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.post('/link', (req, res) => {
  const address = req.body.address.trim()
  const code = randomstring.generate(9)

  Link.create({
    code,
    address,
  }).then((link) => {
    return res.redirect(`/k/${code}`)
  })
})

router.get('/k/:code', (req, res) => {
  var host = req.get('host')
  var protocol = req.protocol
  const base = `${protocol}://${host}`

  const code = req.params.code
  const pagelink = `${base}/k/${code}`
  const directlink = `${base}/g/${code}`
  Link.findOne({
    where: { code: code },
  }).then((link) => {
    if (!link) {
      return res.send('Error: Link not registered')
    }
    res.render('link', { link: link.address, pagelink, directlink })
  })
})

router.get('/g/:code', (req, res) => {
  const code = req.params.code
  Link.findOne({
    where: { code: code },
  }).then((link) => {
    return res.redirect(link.address)
  })
})

router.get('/links/:secret', (req, res) => {
  const { secret } = req.params
  if (secret == process.env.SECRET) {
    Link.findAll({
      order: [['createdAt', 'DESC']],
    }).then((links) => {
      return res.send(links)
    })
  } else {
    return res.sendStatus(403)
  }
})

module.exports = router
