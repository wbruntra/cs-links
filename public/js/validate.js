document.addEventListener('DOMContentLoaded', function() {
  function handleSubmit(e) {
    const address = document.getElementById('address').value.trim()
    const errorElement = document.getElementById('error')
    
    // Clear previous errors
    errorElement.textContent = ''
    
    // Basic validation
    if (!address) {
      errorElement.textContent = 'Please enter a URL'
      e.preventDefault()
      return
    }
    
    // Length validation
    if (address.length > 2048) {
      errorElement.textContent = 'URL too long (max 2048 characters)'
      e.preventDefault()
      return
    }
    
    if (address.length < 10) {
      errorElement.textContent = 'URL too short'
      e.preventDefault()
      return
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /<script/i,
      /onclick/i,
      /onload/i
    ]
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(address)) {
        errorElement.textContent = 'URL contains suspicious content'
        e.preventDefault()
        return
      }
    }
    
    // Enhanced URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    let testUrl = address
    
    // Add protocol if missing
    if (!testUrl.match(/^https?:\/\//i)) {
      testUrl = 'https://' + testUrl
    }
    
    try {
      const url = new URL(testUrl)
      
      // Check for blocked domains
      const hostname = url.hostname.toLowerCase()
      const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0']
      
      for (const domain of blockedDomains) {
        if (hostname === domain || hostname.endsWith('.' + domain)) {
          errorElement.textContent = 'This domain is not allowed'
          e.preventDefault()
          return
        }
      }
      
      // Check for private IP patterns
      if (/^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.)/.test(hostname)) {
        errorElement.textContent = 'Private IP addresses are not allowed'
        e.preventDefault()
        return
      }
      
      console.log('Valid URL!')
      
    } catch (error) {
      errorElement.textContent = 'Invalid URL format'
      e.preventDefault()
    }
  }

  const form = document.getElementById('form')
  form.addEventListener('submit', handleSubmit)
})
