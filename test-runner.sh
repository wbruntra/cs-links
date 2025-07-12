#!/bin/bash

# Local test runner script for CS Linker
# This script runs all tests in the correct order

set -e

echo "🚀 Starting CS Linker Test Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Node modules not found. Installing dependencies..."
    npm install
fi

# Check if Playwright browsers are installed
if [ ! -d "node_modules/playwright/.local-browsers" ]; then
    print_warning "Playwright browsers not found. Installing..."
    npx playwright install
fi

# Start database if needed
print_status "Starting database..."
if ! pgrep -f "docker-compose.*devdb" > /dev/null; then
    npm run dev:db &
    DB_PID=$!
    print_status "Database started with PID: $DB_PID"
    
    # Wait for database to be ready
    echo "Waiting for database to be ready..."
    sleep 10
else
    print_status "Database already running"
fi

# Run unit tests
print_status "Running unit tests..."
if npm run test; then
    print_status "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# Run E2E tests
print_status "Running E2E tests..."
if npm run test:e2e; then
    print_status "E2E tests passed"
else
    print_error "E2E tests failed"
    exit 1
fi

# Generate test report
print_status "Generating test report..."
npm run test:e2e:report

print_status "All tests completed successfully!"
echo "=================================="
echo "📊 Test Report: Check playwright-report/index.html"
echo "🎯 To run tests individually:"
echo "   • Unit tests: npm run test"
echo "   • E2E tests: npm run test:e2e"
echo "   • E2E with UI: npm run test:e2e:ui"
echo "   • E2E headed: npm run test:e2e:headed"
