#!/bin/bash

# Simple build script for client
echo "🏗️  Building Preact client..."
cd client-v2
npm install
npm run build
cd ..

# Copy built files to temporary deployment directory
echo "📋 Preparing deployment files..."
rm -rf deploy-temp
mkdir -p deploy-temp

# Copy all server files (excluding client-v2)
cp -r . deploy-temp/
rm -rf deploy-temp/client-v2
rm -rf deploy-temp/node_modules
rm -rf deploy-temp/.git
rm -rf deploy-temp/deploy-temp

# Replace client directory with built version
rm -rf deploy-temp/client
mv client-v2/dist deploy-temp/client

echo "✅ Build complete! Files ready in deploy-temp/"
