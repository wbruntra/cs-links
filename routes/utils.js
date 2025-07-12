var randomstring = require('randomstring')
const db = require('../db')
const { validateAndSanitizeUrl } = require('./security')

const createLinkWithKnex = async (req, res, next) => {
  try {
    // Check honeypot field (bots often fill hidden fields)
    if (req.body.website) {
      return res.status(400).json({ error: 'Bot detected' })
    }
    
    // Get and validate the address
    const rawAddress = req.body.address
    
    if (!rawAddress) {
      return res.status(400).json({ error: 'Address is required' })
    }

    // Validate and sanitize the URL
    const validation = validateAndSanitizeUrl(rawAddress)
    
    if (!validation.isValid) {
      return res.status(400).json({ error: `Invalid URL: ${validation.error}` })
    }

    const address = validation.sanitizedUrl
    
    // Check if URL already exists
    const existingLink = await db('links').select('code').first().where({
      address
    })
    
    if (existingLink) {
      req.code = existingLink.code
      return next()
    }

    // Generate unique code
    let code
    let attempts = 0
    const maxAttempts = 10
    
    do {
      code = randomstring.generate(9)
      const existing = await db('links').select('code').first().where({ code })
      if (!existing) break
      attempts++
    } while (attempts < maxAttempts)
    
    if (attempts >= maxAttempts) {
      return res.status(500).json({ error: 'Error generating unique code' })
    }

    // Insert the link
    await db('links').insert({
      code,
      address,
    })
    
    req.code = code
    next()

  } catch (e) {
    console.error('Error creating link:', e)
    return res.status(500).json({ error: 'Error creating link' })
  }
}

module.exports = {
  createLinkWithKnex
}