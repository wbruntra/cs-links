var express = require('express')
var router = express.Router()

const db = require('../db')

const { createLinkWithKnex } = require('./utils')

// Helper function to get the base URL from the request
function getBaseUrl(req) {
  // Check for X-Forwarded-Proto header (set by nginx proxy)
  const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'https'
  // Check for X-Forwarded-Host header (set by nginx proxy) first, then X-Original-Host, then Host
  const host = req.get('X-Forwarded-Host') || req.get('X-Original-Host') || req.get('host') || 'localhost:13001'
  return `${protocol}://${host}`
}

router.get('/', function (req, res, next) {
  res.json({ message: 'CS-Linker API', version: '1.0.0' })
})

router.post('/cli', createLinkWithKnex, (req, res) => {
  const URL_BASE = getBaseUrl(req)
  return res.send({
    direct_link: `${URL_BASE}/g/${res.locals.code}`,
    page_link: `${URL_BASE}/k/${res.locals.code}`,
  })
})

router.post('/link', createLinkWithKnex, (req, res) => {
  const URL_BASE = getBaseUrl(req)
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
    
    const URL_BASE = getBaseUrl(req)
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
