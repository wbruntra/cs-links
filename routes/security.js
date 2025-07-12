const validator = require('validator')
const URL = require('url-parse')
const { checkBlacklist } = require('./blacklist')

// Blocked domains/patterns (extend as needed)
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '10.0.0.0/8',
  '192.168.0.0/16',
  '172.16.0.0/12',
  // Add known malicious domains here
]

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /file:/i,
  /ftp:/i,
  /<script/i,
  /onclick/i,
  /onload/i,
  /eval\(/i,
  /\\x/i, // hex encoded
  // More specific URL-encoded suspicious patterns instead of all %XX
  /%3[cC]/i, // %3C = <
  /%3[eE]/i, // %3E = >
  /%22/i,    // %22 = "
  /%27/i,    // %27 = '
  /%28/i,    // %28 = (
  /%29/i,    // %29 = )
  /%3[bB]/i, // %3B = ;
  /%00/i,    // null byte
  /%0[aA]/i, // %0A = newline
  /%0[dD]/i, // %0D = carriage return
]

/**
 * Validates and sanitizes a URL
 * @param {string} url - The URL to validate
 * @returns {object} - { isValid: boolean, sanitizedUrl: string, error: string }
 */
function validateAndSanitizeUrl(url) {
  try {
    // Basic input validation
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL is required and must be a string' }
    }

    // Trim whitespace
    url = url.trim()

    // Check length
    if (url.length > 2048) {
      return { isValid: false, error: 'URL too long (max 2048 characters)' }
    }

    if (url.length < 10) {
      return { isValid: false, error: 'URL too short' }
    }

    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(url)) {
        return { isValid: false, error: 'URL contains suspicious content' }
      }
    }

    // Add protocol if missing
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url
    }

    // Validate URL format
    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    })) {
      return { isValid: false, error: 'Invalid URL format' }
    }

    // Check blacklist
    const blacklistCheck = checkBlacklist(url)
    if (blacklistCheck.isBlacklisted) {
      return { isValid: false, error: blacklistCheck.reason }
    }

    // Parse URL for additional checks
    const parsedUrl = new URL(url)
    
    // Check for blocked domains
    const hostname = parsedUrl.hostname.toLowerCase()
    for (const blockedDomain of BLOCKED_DOMAINS) {
      if (hostname === blockedDomain || hostname.endsWith('.' + blockedDomain)) {
        return { isValid: false, error: 'This domain is not allowed' }
      }
    }

    // Check for private IP addresses
    if (isPrivateIP(hostname)) {
      return { isValid: false, error: 'Private IP addresses are not allowed' }
    }

    // Additional security checks
    if (parsedUrl.username || parsedUrl.password) {
      return { isValid: false, error: 'URLs with credentials are not allowed' }
    }

    // Normalize the URL
    const sanitizedUrl = normalizeUrl(url)

    return { 
      isValid: true, 
      sanitizedUrl: sanitizedUrl,
      error: null 
    }

  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Check if hostname is a private IP
 * @param {string} hostname 
 * @returns {boolean}
 */
function isPrivateIP(hostname) {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipRegex.test(hostname)) {
    return false
  }

  const parts = hostname.split('.').map(Number)
  
  // Check for private IP ranges
  return (
    parts[0] === 10 ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 127) ||
    (parts[0] === 0)
  )
}

/**
 * Normalize URL
 * @param {string} url 
 * @returns {string}
 */
function normalizeUrl(url) {
  const parsed = new URL(url)
  
  // Remove default ports
  if ((parsed.protocol === 'http:' && parsed.port === '80') ||
      (parsed.protocol === 'https:' && parsed.port === '443')) {
    parsed.port = ''
  }
  
  // Remove trailing slash from pathname if it's just "/"
  if (parsed.pathname === '/') {
    parsed.pathname = ''
  }
  
  return parsed.toString()
}

module.exports = {
  validateAndSanitizeUrl
}
