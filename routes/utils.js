var randomstring = require('randomstring')
const db = require('../db')

const createLinkWithKnex = async (req, res, next) => {
  const address = req.body.address.trim()
  const code = randomstring.generate(9)

  try {
    const link = await db('links').insert({
      code,
      address,
    })  
    req.code = code
    next()

  } catch (e) {
    console.log(e)
    return res.status(500).send('Error creating link')
  }

}

module.exports = {
  createLinkWithKnex
}