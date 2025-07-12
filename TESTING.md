# Testing Guide for CS Linker

This document covers the comprehensive testing setup for the CS Linker URL shortener application.

## Test Structure

The application includes two types of tests:

### 1. Unit Tests
- **Location**: `test/routes.test.js`
- **Framework**: Mocha + Chai
- **Purpose**: Test individual routes and API endpoints
- **Command**: `npm run test`

### 2. End-to-End (E2E) Tests
- **Location**: `tests/e2e/`
- **Framework**: Playwright
- **Purpose**: Test complete user workflows in real browsers
- **Command**: `npm run test:e2e`

## E2E Test Files

### Core Functionality Tests
- **`url-shortener.spec.js`**: Main application flows
  - Creating short links
  - Redirecting to original URLs
  - Form validation
  - Error handling
  - Rate limiting
  - Bot detection

### UI/UX Tests
- **`clipboard.spec.js`**: Copy-to-clipboard functionality
  - Copy button behavior
  - Clipboard API integration
  - Error handling for clipboard failures
  - Keyboard navigation

- **`accessibility.spec.js`**: Accessibility and responsive design
  - Keyboard navigation
  - Screen reader compatibility
  - Mobile responsiveness
  - Focus management
  - High contrast mode

### Security Tests
- **`security.spec.js`**: Security features
  - XSS prevention
  - SQL injection protection
  - CSRF protection
  - Input sanitization
  - Malicious URL blocking

### Database Tests
- **`database.spec.js`**: Data persistence and integrity
  - Link persistence across sessions
  - Database error handling
  - Concurrent operations
  - Data validation

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Available Test Commands

```bash
# Run all unit tests
npm run test

# Run all E2E tests
npm run test:e2e

# Run E2E tests with browser UI (helpful for debugging)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser actions)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug

# Show test report
npm run test:e2e:report

# Run all tests (unit + E2E)
npm run test:all
```

### Quick Test Runner
```bash
# Run the comprehensive test suite
./test-runner.sh
```

## Test Configuration

### Playwright Configuration
- **File**: `playwright.config.js`
- **Browsers**: Chrome, Firefox, Safari
- **Base URL**: `http://localhost:3000`
- **Reports**: HTML report with screenshots on failure

### Test Environment
- **Database**: MariaDB test instance
- **Port**: 3000 (auto-started by Playwright)
- **Environment**: `NODE_ENV=testing`

## Writing New Tests

### E2E Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use descriptive test names**: `should create short link for valid URL`
2. **Group related tests**: Use `test.describe()` blocks
3. **Clean up after tests**: Use `beforeEach` and `afterEach`
4. **Test both success and failure cases**
5. **Use appropriate assertions**: `toBeVisible()`, `toContainText()`, etc.
6. **Handle async operations**: Use `waitForURL()`, `waitForTimeout()`

## Debugging Tests

### Debug Mode
```bash
# Run specific test in debug mode
npx playwright test --debug tests/e2e/url-shortener.spec.js
```

### Browser Developer Tools
```bash
# Run with browser UI to inspect elements
npm run test:e2e:ui
```

### Screenshots and Videos
- Screenshots are automatically captured on test failures
- Videos can be enabled in `playwright.config.js`
- Traces are captured for failed tests

## CI/CD Integration

### GitHub Actions
- **File**: `.github/workflows/ci.yml`
- **Runs on**: Push to main/develop, Pull Requests
- **Includes**:
  - Unit tests
  - E2E tests
  - Security scanning
  - Docker builds

### Test Reports
- HTML reports are generated automatically
- Artifacts are uploaded to GitHub Actions
- Reports include screenshots and execution traces

## Common Issues and Solutions

### Database Connection Errors
```bash
# Ensure database is running
npm run dev:db

# Check database status
docker-compose -f devdb/docker-compose.yml ps
```

### Playwright Browser Issues
```bash
# Reinstall browsers
npx playwright install --force

# Install system dependencies
npx playwright install-deps
```

### Port Conflicts
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>
```

## Performance Considerations

- Tests run in parallel by default
- Use `fullyParallel: true` in config
- Consider test isolation for database operations
- Use `test.slow()` for longer tests

## Security Testing

The security test suite covers:
- Input validation
- XSS prevention
- SQL injection protection
- CSRF protection
- Rate limiting
- Bot detection

## Accessibility Testing

The accessibility test suite covers:
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management
- Mobile responsiveness

## Monitoring and Reporting

- Test results are reported in multiple formats
- Failed tests include screenshots
- Performance metrics are tracked
- Security scan results are included

## Contributing

When adding new features:
1. Write unit tests for new routes/functions
2. Add E2E tests for new user workflows
3. Update security tests for new endpoints
4. Ensure accessibility compliance
5. Run full test suite before submitting PR

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
