// Simple blacklist system for known malicious domains
// In a production environment, this should be stored in a database
// and updated regularly from threat intelligence feeds

const BLACKLISTED_DOMAINS = [
  // Malware/Phishing (examples - add real ones as needed)
  'malware.com',
  'phishing-site.com',
  'virus-download.net',
  
  // URL shorteners that could be used for abuse
  'bit.ly',
  'tinyurl.com',
  'goo.gl',
  't.co',
  'ow.ly',
  'short.link',
  
  // Adult content (if you want to block)
  // 'adult-site.com',
  
  // Add other domains as needed
]

const BLACKLISTED_KEYWORDS = [
  'malware',
  'virus',
  'trojan',
  'ransomware',
  'phishing',
  'scam',
  'fraud',
  'hack',
  'exploit',
  'crack',
  'keygen',
  'warez',
  'illegal',
  'piracy',
  'torrent'
]

/**
 * Check if a URL is blacklisted
 * @param {string} url - The URL to check
 * @returns {object} - { isBlacklisted: boolean, reason: string }
 */
function checkBlacklist(url) {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    const fullUrl = url.toLowerCase()
    
    // Check domain blacklist
    for (const domain of BLACKLISTED_DOMAINS) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        return {
          isBlacklisted: true,
          reason: `Domain ${domain} is blacklisted`
        }
      }
    }
    
    // Check keyword blacklist
    for (const keyword of BLACKLISTED_KEYWORDS) {
      if (fullUrl.includes(keyword)) {
        return {
          isBlacklisted: true,
          reason: `URL contains blacklisted keyword: ${keyword}`
        }
      }
    }
    
    return { isBlacklisted: false, reason: null }
    
  } catch (error) {
    return { isBlacklisted: true, reason: 'Invalid URL format' }
  }
}

module.exports = {
  checkBlacklist,
  BLACKLISTED_DOMAINS,
  BLACKLISTED_KEYWORDS
}
