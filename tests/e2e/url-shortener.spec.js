const { test, expect } = require('@playwright/test');

test.describe('URL Shortener App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/CS Linker/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('CS Linker');
    
    // Check form elements exist
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check honeypot field is hidden
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveCSS('display', 'none');
  });

  test('should create a short link for valid URL', async ({ page }) => {
    const testUrl = 'https://example.com';
    
    // Fill in the URL
    await page.fill('input[name="url"]', testUrl);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to the link page
    await page.waitForURL(/\/k\/\w+/);
    
    // Check that we're on the link page
    await expect(page.locator('h1')).toContainText('Your link has been created!');
    
    // Check that the short link is displayed
    const shortLink = page.locator('.short-link');
    await expect(shortLink).toBeVisible();
    await expect(shortLink).toContainText('localhost:3000/');
    
    // Check that the copy button is visible
    await expect(page.locator('#copy-btn')).toBeVisible();
    
    // Check that the original URL is displayed
    await expect(page.locator('.original-url')).toContainText(testUrl);
  });

  test('should redirect when visiting a short link', async ({ page }) => {
    const testUrl = 'https://httpbin.org/get';
    
    // First, create a short link
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    // Wait for navigation and extract the short code
    await page.waitForURL(/\/k\/\w+/);
    const url = page.url();
    const shortCode = url.split('/k/')[1];
    
    // Visit the short link directly
    await page.goto(`/g/${shortCode}`);
    
    // Should redirect to the original URL
    await page.waitForURL(testUrl);
    await expect(page.url()).toBe(testUrl);
  });

  test('should show error for invalid URL', async ({ page }) => {
    const invalidUrl = 'not-a-valid-url';
    
    // Fill in an invalid URL
    await page.fill('input[name="url"]', invalidUrl);
    await page.click('button[type="submit"]');
    
    // Should stay on the same page with error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid URL');
  });

  test('should show error for blocked domain', async ({ page }) => {
    const blockedUrl = 'https://malware.com';
    
    // Fill in a blocked URL
    await page.fill('input[name="url"]', blockedUrl);
    await page.click('button[type="submit"]');
    
    // Should stay on the same page with error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('blocked');
  });

  test('should validate URL format on client side', async ({ page }) => {
    const invalidUrl = 'invalid-url';
    
    // Fill in an invalid URL
    await page.fill('input[name="url"]', invalidUrl);
    
    // Check for HTML5 validation
    const urlInput = page.locator('input[name="url"]');
    const validationMessage = await urlInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    // Make multiple rapid requests to trigger rate limiting
    const testUrl = 'https://example.com';
    
    for (let i = 0; i < 20; i++) {
      await page.fill('input[name="url"]', `${testUrl}/${i}`);
      await page.click('button[type="submit"]');
      
      // If we hit rate limiting, check for appropriate error
      if (await page.locator('.error-message').isVisible()) {
        await expect(page.locator('.error-message')).toContainText('Too many requests');
        break;
      }
      
      // If successful, go back to home page
      if (page.url().includes('/k/')) {
        await page.goto('/');
      }
    }
  });

  test('should detect bot behavior with honeypot', async ({ page }) => {
    const testUrl = 'https://example.com';
    
    // Fill in the URL
    await page.fill('input[name="url"]', testUrl);
    
    // Fill in the honeypot field (simulate bot behavior)
    await page.fill('input[name="website"]', 'bot-filled-this');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should be rejected as bot
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid request');
  });

  test('should handle empty URL submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation error
    const urlInput = page.locator('input[name="url"]');
    const validationMessage = await urlInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should handle very long URLs', async ({ page }) => {
    // Create a very long URL
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);
    
    await page.fill('input[name="url"]', longUrl);
    await page.click('button[type="submit"]');
    
    // Should either create successfully or show appropriate error
    const hasError = await page.locator('.error-message').isVisible();
    const hasSuccess = page.url().includes('/k/');
    
    expect(hasError || hasSuccess).toBeTruthy();
  });

  test('should handle special characters in URLs', async ({ page }) => {
    const urlWithSpecialChars = 'https://example.com/path?query=value&special=ñáéíóú';
    
    await page.fill('input[name="url"]', urlWithSpecialChars);
    await page.click('button[type="submit"]');
    
    // Should create successfully
    await page.waitForURL(/\/link\/\w+/);
    await expect(page.locator('.original-url')).toContainText(urlWithSpecialChars);
  });

  test('should handle case sensitivity correctly', async ({ page }) => {
    const testUrl = 'https://EXAMPLE.COM/PATH';
    
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    // Should create successfully
    await page.waitForURL(/\/link\/\w+/);
    await expect(page.locator('.original-url')).toContainText(testUrl);
  });

  test('should handle 404 for invalid short codes', async ({ page }) => {
    // Visit a non-existent short code
    await page.goto('/nonexistent123');
    
    // Should show 404 error
    await expect(page.locator('h1')).toContainText('404');
  });

  test('should preserve URL fragments and query parameters', async ({ page }) => {
    const urlWithFragment = 'https://example.com/page#section?param=value';
    
    await page.fill('input[name="url"]', urlWithFragment);
    await page.click('button[type="submit"]');
    
    // Should create successfully
    await page.waitForURL(/\/link\/\w+/);
    await expect(page.locator('.original-url')).toContainText(urlWithFragment);
  });
});
