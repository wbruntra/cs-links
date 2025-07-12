const { validateAndSanitizeUrl } = require('./routes/security')

console.log('=== Security Validation Test Suite ===\n')

// Test cases
const testCases = [
  // Legitimate URLs that should PASS
  {
    name: 'Amazon URL with accented characters',
    url: "https://www.amazon.es/Sakura-SS3624-Cable-Arranque-metres/dp/B004A9164G/ref=sr_1_5?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1ZNOASOYRN3GF&dib=eyJ2IjoiMSJ9.EpyhMAEaUGxONw1iOjuqg48zpToWNwxJHorSYrLmxK27stOrs9VJPQNYCpJLr21AA6rbjPitDRp5iI3B7oPkKL1DrL-9MtZTlj3-zw0OzzkIg2tD5GYmA7rA9bQC7JpHf1bE5SODTaPz72C8ns82-wa8VHAdiEQTtprOTgqWU9u-2MoR0G1BRXOjZ3ZItxlErNL8o2NFslrW-WdS3Q8ysh3kkoUBe4bBfBcMQo0x71w-fXZ6hdlP2HK3as4vHmDMH64ipmzEqKWs3BVMV2bqPDZ-3iuSufpIeAxd7ziiQB8.zblAAhbOT9v4Uc0LAqtapM8oEHB-i_RntvIi0vOrtrk&dib_tag=se&keywords=jumper+cable+car&qid=1723128927&sprefix=jumper+cable+car%2Caps%2C167&sr=8-5",
    expectValid: true
  },
  {
    name: 'Google search with spaces',
    url: "https://www.google.com/search?q=hello%20world&ie=UTF-8",
    expectValid: true
  },
  {
    name: 'GitHub URL',
    url: "https://github.com/user/repo/issues?q=is%3Aopen+is%3Aissue",
    expectValid: true
  },
  {
    name: 'Wikipedia with international chars',
    url: "https://es.wikipedia.org/wiki/Espa%C3%B1a",
    expectValid: true
  },
  {
    name: 'YouTube URL',
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    expectValid: true
  },
  
  // Malicious URLs that should FAIL
  {
    name: 'JavaScript protocol',
    url: "javascript:alert('xss')",
    expectValid: false
  },
  {
    name: 'Data URL',
    url: "data:text/html,<script>alert('xss')</script>",
    expectValid: false
  },
  {
    name: 'Script tag in URL',
    url: "https://example.com/<script>alert('xss')</script>",
    expectValid: false
  },
  {
    name: 'URL-encoded script tag',
    url: "https://example.com/?q=%3Cscript%3Ealert('xss')%3C/script%3E",
    expectValid: false
  },
  {
    name: 'URL-encoded quotes',
    url: "https://example.com/?q=%22%27onclick=alert()%22",
    expectValid: false
  },
  {
    name: 'Private IP address',
    url: "https://192.168.1.1/admin",
    expectValid: false
  },
  {
    name: 'Localhost',
    url: "https://localhost:3000/admin",
    expectValid: false
  },
  {
    name: 'File protocol',
    url: "file:///etc/passwd",
    expectValid: false
  },
]

// Run tests
let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. Testing: ${testCase.name}`)
  console.log(`   URL: ${testCase.url.substring(0, 80)}${testCase.url.length > 80 ? '...' : ''}`)
  
  const result = validateAndSanitizeUrl(testCase.url)
  const success = result.isValid === testCase.expectValid
  
  if (success) {
    console.log(`   ✅ PASS - Expected: ${testCase.expectValid ? 'valid' : 'invalid'}, Got: ${result.isValid ? 'valid' : 'invalid'}`)
    passed++
  } else {
    console.log(`   ❌ FAIL - Expected: ${testCase.expectValid ? 'valid' : 'invalid'}, Got: ${result.isValid ? 'valid' : 'invalid'}`)
    if (!result.isValid && result.error) {
      console.log(`   Error: ${result.error}`)
    }
    failed++
  }
  console.log('')
})

console.log(`=== Test Results ===`)
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`📊 Total: ${passed + failed}`)

if (failed === 0) {
  console.log('🎉 All tests passed! Security validation is working correctly.')
} else {
  console.log('⚠️  Some tests failed. Please review the security patterns.')
}
