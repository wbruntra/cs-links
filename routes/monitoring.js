const fs = require('fs').promises
const path = require('path')

// Simple logging middleware for suspicious activity
const logSuspiciousActivity = async (req, res, next) => {
  try {
    const suspiciousPatterns = [
      /script/i,
      /select.*from/i,
      /union.*select/i,
      /drop.*table/i,
      /insert.*into/i,
      /update.*set/i,
      /delete.*from/i,
      /<iframe/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i
    ]
    
    const userAgent = req.get('User-Agent') || ''
    const bodyContent = JSON.stringify(req.body)
    const queryContent = JSON.stringify(req.query)
    const urlContent = req.url
    
    const allContent = `${bodyContent} ${queryContent} ${urlContent} ${userAgent}`
    
    let isSuspicious = false
    let matchedPattern = ''
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(allContent)) {
        isSuspicious = true
        matchedPattern = pattern.toString()
        break
      }
    }
    
    if (isSuspicious) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: userAgent,
        url: req.url,
        method: req.method,
        body: req.body,
        query: req.query,
        suspiciousPattern: matchedPattern,
        headers: req.headers
      }
      
      const logPath = path.join(__dirname, '..', 'logs', 'suspicious.log')
      await fs.mkdir(path.dirname(logPath), { recursive: true })
      await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n')
      
      console.warn('Suspicious activity detected:', logEntry)
    }
  } catch (error) {
    console.error('Error in suspicious activity logging:', error)
  }
  
  next()
}

module.exports = {
  logSuspiciousActivity
}
