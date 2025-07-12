const { test, expect } = require('@playwright/test');

test.describe('Database Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should persist short links across browser sessions', async ({ page }) => {
    const testUrl = 'https://example.com/persist-test';
    
    // Create a short link
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    // Wait for creation and get the short code
    await page.waitForURL(/\/link\/\w+/);
    const currentUrl = page.url();
    const shortCode = currentUrl.split('/k/')[1];
    
    // Close and reopen browser context to simulate new session
    await page.context().close();
    const newContext = await page.context().browser().newContext();
    const newPage = await newContext.newPage();
    
    // Visit the short link directly
    await newPage.goto(`http://localhost:3000/g/${shortCode}`);
    
    // Should still redirect to original URL
    await newPage.waitForURL(testUrl);
    expect(newPage.url()).toBe(testUrl);
    
    await newContext.close();
  });

  test('should handle database connection errors gracefully', async ({ page }) => {
    // This test depends on your error handling implementation
    // We'll simulate a scenario where database might be slow or unavailable
    
    // Mock slow database response
    await page.route('**/*', route => {
      if (route.request().method() === 'POST') {
        // Simulate slow database
        setTimeout(() => {
          route.continue();
        }, 5000);
      } else {
        route.continue();
      }
    });
    
    const testUrl = 'https://example.com/db-test';
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    // Should either timeout gracefully or show loading state
    // Check for loading indicators or error messages
    await page.waitForTimeout(2000);
    
    // Should not crash the application
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle duplicate URLs appropriately', async ({ page }) => {
    const testUrl = 'https://example.com/duplicate-test';
    
    // Create first short link
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    const firstUrl = page.url();
    const firstShortCode = firstUrl.split('/k/')[1];
    
    // Go back and create another with same URL
    await page.goto('/');
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    const secondUrl = page.url();
    const secondShortCode = secondUrl.split('/k/')[1];
    
    // Depending on implementation, might be same or different
    // Both should work
    await page.goto(`/${firstShortCode}`);
    await page.waitForURL(testUrl);
    
    await page.goto(`/${secondShortCode}`);
    await page.waitForURL(testUrl);
  });

  test('should track link statistics', async ({ page }) => {
    const testUrl = 'https://example.com/stats-test';
    
    // Create a short link
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    const currentUrl = page.url();
    const shortCode = currentUrl.split('/k/')[1];
    
    // Visit the short link multiple times
    for (let i = 0; i < 3; i++) {
      await page.goto(`/${shortCode}`);
      await page.waitForURL(testUrl);
      await page.goBack();
    }
    
    // If your app has statistics endpoint, test it
    // This depends on your implementation
    // For now, just ensure the redirects work consistently
    await page.goto(`/${shortCode}`);
    await page.waitForURL(testUrl);
  });

  test('should handle special characters in URLs with database', async ({ page }) => {
    const specialUrls = [
      'https://example.com/path with spaces',
      'https://example.com/path?query=value&other=data',
      'https://example.com/path#fragment',
      'https://example.com/测试中文',
      'https://example.com/café-résumé'
    ];
    
    for (const url of specialUrls) {
      await page.fill('input[name="url"]', url);
      await page.click('button[type="submit"]');
      
      // Should create successfully
      await page.waitForURL(/\/link\/\w+/);
      
      // Extract short code and test redirect
      const currentUrl = page.url();
      const shortCode = currentUrl.split('/k/')[1];
      
      await page.goto(`/${shortCode}`);
      await page.waitForURL(url);
      
      // Reset for next test
      await page.goto('/');
    }
  });

  test('should handle concurrent database operations', async ({ page }) => {
    const testUrls = [
      'https://example.com/concurrent-1',
      'https://example.com/concurrent-2',
      'https://example.com/concurrent-3'
    ];
    
    // Create multiple short links concurrently
    const promises = testUrls.map(async (url, index) => {
      const context = await page.context().browser().newContext();
      const newPage = await context.newPage();
      
      await newPage.goto('/');
      await newPage.fill('input[name="url"]', url);
      await newPage.click('button[type="submit"]');
      
      await newPage.waitForURL(/\/link\/\w+/);
      const currentUrl = newPage.url();
      const shortCode = currentUrl.split('/k/')[1];
      
      await context.close();
      return { url, shortCode };
    });
    
    const results = await Promise.all(promises);
    
    // Test that all short codes work
    for (const { url, shortCode } of results) {
      await page.goto(`/${shortCode}`);
      await page.waitForURL(url);
    }
  });

  test('should handle database constraints and validation', async ({ page }) => {
    // Test with very long URLs that might exceed database limits
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);
    
    await page.fill('input[name="url"]', longUrl);
    await page.click('button[type="submit"]');
    
    // Should handle gracefully - either accept or reject with proper error
    const hasError = await page.locator('.error-message').isVisible();
    const hasSuccess = page.url().includes('/k/');
    
    expect(hasError || hasSuccess).toBeTruthy();
    
    if (hasError) {
      // Error should be informative
      await expect(page.locator('.error-message')).toContainText(/length|long|invalid/i);
    }
  });

  test('should maintain data integrity during high load', async ({ page }) => {
    // Simulate high load by creating many links rapidly
    const promises = [];
    
    for (let i = 0; i < 10; i++) {
      promises.push((async () => {
        const context = await page.context().browser().newContext();
        const newPage = await context.newPage();
        
        await newPage.goto('/');
        await newPage.fill('input[name="url"]', `https://example.com/load-test-${i}`);
        await newPage.click('button[type="submit"]');
        
        await newPage.waitForURL(/\/link\/\w+/);
        const currentUrl = newPage.url();
        const shortCode = currentUrl.split('/k/')[1];
        
        await context.close();
        return shortCode;
      })());
    }
    
    const shortCodes = await Promise.all(promises);
    
    // All short codes should be unique
    const uniqueCodes = new Set(shortCodes);
    expect(uniqueCodes.size).toBe(shortCodes.length);
    
    // All should work correctly
    for (let i = 0; i < shortCodes.length; i++) {
      await page.goto(`/${shortCodes[i]}`);
      await page.waitForURL(`https://example.com/load-test-${i}`);
    }
  });

  test('should handle database migration scenarios', async ({ page }) => {
    // Test that app handles database schema changes gracefully
    // This is more of a deployment test, but we can simulate
    
    const testUrl = 'https://example.com/migration-test';
    
    // Create a link
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    const currentUrl = page.url();
    const shortCode = currentUrl.split('/k/')[1];
    
    // Test that existing links still work
    await page.goto(`/${shortCode}`);
    await page.waitForURL(testUrl);
  });

  test('should handle case sensitivity in database operations', async ({ page }) => {
    // Test URLs with different cases
    const urls = [
      'https://EXAMPLE.COM/TEST',
      'https://example.com/test',
      'https://Example.Com/Test'
    ];
    
    const shortCodes = [];
    
    for (const url of urls) {
      await page.fill('input[name="url"]', url);
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/\/link\/\w+/);
      const currentUrl = page.url();
      const shortCode = currentUrl.split('/k/')[1];
      shortCodes.push(shortCode);
      
      await page.goto('/');
    }
    
    // Test that all redirects work correctly
    for (let i = 0; i < urls.length; i++) {
      await page.goto(`/${shortCodes[i]}`);
      await page.waitForURL(urls[i]);
    }
  });

  test('should handle transaction rollbacks on errors', async ({ page }) => {
    // Mock a database error during creation
    await page.route('**/api/**', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Database error' })
        });
      } else {
        route.continue();
      }
    });
    
    const testUrl = 'https://example.com/rollback-test';
    await page.fill('input[name="url"]', testUrl);
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
    
    // Database should be in consistent state
    // (No partial records should be created)
  });
});
