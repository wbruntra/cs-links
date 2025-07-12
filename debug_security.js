const { validateAndSanitizeUrl } = require('./routes/security')

// Test URL from the user
const testUrl = "https://www.amazon.es/Sakura-SS3624-Cable-Arranque-metres/dp/B004A9164G/ref=sr_1_5?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1ZNOASOYRN3GF&dib=eyJ2IjoiMSJ9.EpyhMAEaUGxONw1iOjuqg48zpToWNwxJHorSYrLmxK27stOrs9VJPQNYCpJLr21AA6rbjPitDRp5iI3B7oPkKL1DrL-9MtZTlj3-zw0OzzkIg2tD5GYmA7rA9bQC7JpHf1bE5SODTaPz72C8ns82-wa8VHAdiEQTtprOTgqWU9u-2MoR0G1BRXOjZ3ZItxlErNL8o2NFslrW-WdS3Q8ysh3kkoUBe4bBfBcMQo0x71w-fXZ6hdlP2HK3as4vHmDMH64ipmzEqKWs3BVMV2bqPDZ-3iuSufpIeAxd7ziiQB8.zblAAhbOT9v4Uc0LAqtapM8oEHB-i_RntvIi0vOrtrk&dib_tag=se&keywords=jumper+cable+car&qid=1723128927&sprefix=jumper+cable+car%2Caps%2C167&sr=8-5"

console.log('Testing URL:', testUrl)
console.log('URL length:', testUrl.length)
console.log('\n--- Starting validation ---')

// Test the validation
const result = validateAndSanitizeUrl(testUrl)
console.log('Validation result:', result)

// Let's also test individual suspicious patterns to see which one is matching
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

console.log('\n--- Testing suspicious patterns ---')
SUSPICIOUS_PATTERNS.forEach((pattern, index) => {
  if (pattern.test(testUrl)) {
    console.log(`Pattern ${index} MATCHED: ${pattern}`)
  } else {
    console.log(`Pattern ${index} passed: ${pattern}`)
  }
})

// Let's also decode the URL to see what's in it
console.log('\n--- URL Analysis ---')
try {
  const url = new URL(testUrl)
  console.log('Protocol:', url.protocol)
  console.log('Hostname:', url.hostname)
  console.log('Pathname:', url.pathname)
  console.log('Search params:', url.search)
  
  // Check for specific characters that might be flagged
  console.log('\nChecking for specific characters:')
  console.log('Contains %:', testUrl.includes('%'))
  console.log('Contains \\x:', testUrl.includes('\\x'))
  console.log('Contains eval(:', testUrl.includes('eval('))
  
  // Let's decode the URL-encoded parts
  console.log('\nDecoded URL:', decodeURIComponent(testUrl))
  
} catch (e) {
  console.log('Error parsing URL:', e.message)
}
