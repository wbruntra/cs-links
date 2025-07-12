#!/bin/bash

echo "Testing API endpoints..."

# Test root endpoint
echo "1. Testing root endpoint:"
curl -s http://localhost:13001/ | jq .

echo ""

# Test creating a link
echo "2. Testing link creation:"
RESPONSE=$(curl -s -X POST http://localhost:13001/cli \
  -H "Content-Type: application/json" \
  -d '{"address": "https://example.com"}')

echo $RESPONSE | jq .

# Extract the code from the response
CODE=$(echo $RESPONSE | jq -r '.direct_link' | sed 's/.*\/g\///')

echo ""

# Test getting link info
echo "3. Testing link info retrieval:"
curl -s http://localhost:13001/k/$CODE | jq .

echo ""

# Test direct redirect (this will show the redirect response)
echo "4. Testing direct redirect:"
curl -s -I http://localhost:13001/g/$CODE

echo ""
echo "API testing complete!"
