var express = require('express')
var router = express.Router()
var randomstring = require('randomstring')

var Link = require('../models/Link')

const URL_BASE = process.env.URL_BASE || 'http://localhost:3000'

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
  const code = req.params.code
  const pagelink = `${URL_BASE}/k/${code}`
  const directlink = `${URL_BASE}/g/${code}`
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
