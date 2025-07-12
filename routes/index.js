var express = require('express')
var router = express.Router()

const db = require('../db')

const { createLinkWithKnex } = require('./utils')

const URL_BASE = process.env.URL_BASE || 'http://localhost:13001'

router.get('/', function (req, res, next) {
  res.json({ message: 'CS-Linker API', version: '1.0.0' })
})

router.post('/cli', createLinkWithKnex, (req, res) => {
  return res.send({
    direct_link: `${URL_BASE}/g/${res.locals.code}`,
    page_link: `${URL_BASE}/k/${res.locals.code}`,
  })
})

router.post('/link', createLinkWithKnex, (req, res) => {
  return res.json({
    direct_link: `${URL_BASE}/g/${res.locals.code}`,
    page_link: `${URL_BASE}/k/${res.locals.code}`,
    code: res.locals.code
  })
})

router.get('/k/:code', async (req, res) => {
  try {
    const code = req.params.code
    
    // Basic validation of code format
    if (!code || typeof code !== 'string' || code.length !== 9 || !/^[a-zA-Z0-9]+$/.test(code)) {
      return res.status(400).json({ error: 'Invalid link code' })
    }
    
    const pagelink = `${URL_BASE}/k/${code}`
    const directlink = `${URL_BASE}/g/${code}`

    const link = await db('links').select().first().where({
      code,
    })
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' })
    }
    
    return res.json({ 
      originalUrl: link.address, 
      pageLink: pagelink, 
      directLink: directlink,
      code: code
    })
  } catch (error) {
    console.error('Error loading link page:', error)
    return res.status(500).json({ error: 'Error loading link page' })
  }
})

router.get('/g/:code', async (req, res) => {
  try {
    const code = req.params.code
    
    // Basic validation of code format
    if (!code || typeof code !== 'string' || code.length !== 9 || !/^[a-zA-Z0-9]+$/.test(code)) {
      return res.status(400).json({ error: 'Invalid link code' })
    }

    const link = await db('links').select().first().where({
      code,
    })
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' })
    }
    
    return res.redirect(link.address)
  } catch (error) {
    console.error('Error redirecting:', error)
    return res.status(500).json({ error: 'Error processing redirect' })
  }
})

// GET all links
router.get('/links/:secret', async (req, res) => {
  try {
    const { secret } = req.params
    
    // Input validation
    if (!secret || typeof secret !== 'string') {
      return res.status(400).json({ error: 'Invalid secret format' })
    }
    
    if (secret !== process.env.SECRET) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    const links = await db('links').select().orderBy('createdAt', 'desc')
    return res.json(links)
  } catch (error) {
    console.error('Error getting links:', error)
    return res.status(500).json({ error: 'Error getting links' })
  }
})

module.exports = router
