var express = require('express')
var router = express.Router()

const db = require('../db')

const { createLinkWithKnex } = require('./utils')

const URL_BASE = process.env.URL_BASE || 'http://localhost:3000'

router.get('/', function (req, res, next) {
  res.render('index')
})

router.post('/cli', createLinkWithKnex, (req, res) => {
  return res.send({
    direct_link: `${URL_BASE}/g/${req.code}`,
    page_link: `${URL_BASE}/k/${req.code}`,
  })
})

router.post('/link', createLinkWithKnex, (req, res) => {
  return res.redirect(`/k/${req.code}`)
})

router.get('/k/:code', async (req, res) => {
  const code = req.params.code
  const pagelink = `${URL_BASE}/k/${code}`
  const directlink = `${URL_BASE}/g/${code}`

  const link = await db('links').select().first().where({
    code,
  })
  if (!link) {
    return res.send('Error: Link not registered')
  }
  return res.render('link', { link: link.address, pagelink, directlink })
})

router.get('/g/:code', async (req, res) => {
  const code = req.params.code

  const link = await db('links').select().first().where({
    code,
  })
  return res.redirect(link.address)
})

// GET all links
router.get('/links/:secret', async (req, res) => {
  const { secret } = req.params
  if (secret == process.env.SECRET) {
    try {
      const links = await db('links').select().orderBy('createdAt', 'desc')
      return res.send(links)
    } catch (e) {
      console.log(e)
      return res.status(500).send('Error getting links')
    }
  } else {
    return res.sendStatus(403)
  }
})

module.exports = router
