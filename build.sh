#!/bin/bash

# Simple build script for client
echo "🏗️  Building Vue client..."
cd client-vite
npm install
npm run build
cd ..

# Copy built files to temporary deployment directory
echo "📋 Preparing deployment files..."
rm -rf deploy-temp
mkdir -p deploy-temp

# Copy all server files (excluding client-vite)
cp -r . deploy-temp/
rm -rf deploy-temp/client-vite
rm -rf deploy-temp/node_modules
rm -rf deploy-temp/.git
rm -rf deploy-temp/deploy-temp

# Replace client directory with built version
rm -rf deploy-temp/client
mv client-vite/dist deploy-temp/client

echo "✅ Build complete! Files ready in deploy-temp/"
