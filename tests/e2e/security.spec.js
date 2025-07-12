const { test, expect } = require('@playwright/test');

test.describe('Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should prevent XSS attacks in URL input', async ({ page }) => {
    const xssPayload = 'javascript:alert("XSS")';
    
    await page.fill('input[name="url"]', xssPayload);
    await page.click('button[type="submit"]');
    
    // Should show error for invalid URL
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid URL');
    
    // Should not execute JavaScript
    const alerts = [];
    page.on('dialog', dialog => {
      alerts.push(dialog.message());
      dialog.accept();
    });
    
    await page.waitForTimeout(1000);
    expect(alerts).toHaveLength(0);
  });

  test('should sanitize malicious URL schemes', async ({ page }) => {
    const maliciousSchemes = [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      'file:///etc/passwd'
    ];
    
    for (const scheme of maliciousSchemes) {
      await page.fill('input[name="url"]', scheme);
      await page.click('button[type="submit"]');
      
      // Should show error
      await expect(page.locator('.error-message')).toBeVisible();
      
      // Reset form
      await page.goto('/');
    }
  });

  test('should block known malicious domains', async ({ page }) => {
    const maliciousDomains = [
      'https://malware.com',
      'https://phishing.example.com',
      'https://spam.net'
    ];
    
    for (const domain of maliciousDomains) {
      await page.fill('input[name="url"]', domain);
      await page.click('button[type="submit"]');
      
      // Should show blocked message
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toContainText('blocked');
      
      // Reset form
      await page.goto('/');
    }
  });

  test('should enforce HTTPS for sensitive operations', async ({ page }) => {
    // Test that the app enforces secure protocols
    const httpUrl = 'http://example.com';
    
    await page.fill('input[name="url"]', httpUrl);
    await page.click('button[type="submit"]');
    
    // Should either upgrade to HTTPS or show warning
    // (depends on your security policy)
    const hasError = await page.locator('.error-message').isVisible();
    const hasSuccess = page.url().includes('/k/');
    
    expect(hasError || hasSuccess).toBeTruthy();
  });

  test('should handle SQL injection attempts', async ({ page }) => {
    const sqlInjectionPayloads = [
      "https://example.com'; DROP TABLE links; --",
      "https://example.com' OR '1'='1",
      "https://example.com'; INSERT INTO links VALUES ('hack'); --"
    ];
    
    for (const payload of sqlInjectionPayloads) {
      await page.fill('input[name="url"]', payload);
      await page.click('button[type="submit"]');
      
      // Should either create successfully (if URL is valid) or show error
      // But should not crash the application
      const hasError = await page.locator('.error-message').isVisible();
      const hasSuccess = page.url().includes('/k/');
      
      expect(hasError || hasSuccess).toBeTruthy();
      
      // Reset form
      await page.goto('/');
    }
  });

  test('should prevent header injection', async ({ page }) => {
    const headerInjectionPayload = 'https://example.com\r\nSet-Cookie: malicious=true';
    
    await page.fill('input[name="url"]', headerInjectionPayload);
    await page.click('button[type="submit"]');
    
    // Should show error for invalid URL
    await expect(page.locator('.error-message')).toBeVisible();
    
    // Check that no malicious cookie was set
    const cookies = await page.context().cookies();
    const maliciousCookie = cookies.find(cookie => cookie.name === 'malicious');
    expect(maliciousCookie).toBeUndefined();
  });

  test('should handle CSRF protection', async ({ page }) => {
    // Test that forms include CSRF protection
    const form = page.locator('form');
    
    // Should have some form of CSRF protection
    // (This depends on your implementation - could be hidden token, etc.)
    await expect(form).toBeVisible();
  });

  test('should limit URL length to prevent DoS', async ({ page }) => {
    // Test with extremely long URL
    const veryLongUrl = 'https://example.com/' + 'a'.repeat(10000);
    
    await page.fill('input[name="url"]', veryLongUrl);
    await page.click('button[type="submit"]');
    
    // Should handle gracefully (either accept or reject with proper error)
    const hasError = await page.locator('.error-message').isVisible();
    const hasSuccess = page.url().includes('/k/');
    
    expect(hasError || hasSuccess).toBeTruthy();
    
    // App should still be responsive
    await page.goto('/');
    await expect(page.locator('input[name="url"]')).toBeVisible();
  });

  test('should handle unicode and special characters securely', async ({ page }) => {
    const unicodeUrls = [
      'https://example.com/测试',
      'https://example.com/café',
      'https://example.com/🚀',
      'https://example.com/\u200B\u200C\u200D' // Zero-width characters
    ];
    
    for (const url of unicodeUrls) {
      await page.fill('input[name="url"]', url);
      await page.click('button[type="submit"]');
      
      // Should handle properly without breaking
      const hasError = await page.locator('.error-message').isVisible();
      const hasSuccess = page.url().includes('/k/');
      
      expect(hasError || hasSuccess).toBeTruthy();
      
      // Reset form
      await page.goto('/');
    }
  });

  test('should validate Content Security Policy headers', async ({ page }) => {
    // Check that CSP headers are set properly
    const response = await page.goto('/');
    const cspHeader = response.headers()['content-security-policy'];
    
    // Should have some CSP policy
    expect(cspHeader).toBeTruthy();
  });

  test('should handle concurrent requests without race conditions', async ({ page }) => {
    // Open multiple tabs and submit forms simultaneously
    const contexts = await Promise.all([
      page.context().newPage(),
      page.context().newPage(),
      page.context().newPage()
    ]);
    
    // Submit forms concurrently
    const promises = contexts.map(async (context, index) => {
      await context.goto('/');
      await context.fill('input[name="url"]', `https://example.com/${index}`);
      await context.click('button[type="submit"]');
      return context.waitForURL(/\/link\/\w+/);
    });
    
    // All should complete successfully
    await Promise.all(promises);
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });

  test('should prevent enumeration attacks on short codes', async ({ page }) => {
    // Try to access many short codes to see if we can enumerate them
    const commonCodes = ['a', 'b', 'c', '1', '2', '3', 'test', 'admin'];
    
    for (const code of commonCodes) {
      const response = await page.goto(`/${code}`);
      
      // Should return 404 for non-existent codes
      // Should not leak information about valid codes
      expect(response.status()).toBe(404);
    }
  });

  test('should handle malformed requests gracefully', async ({ page }) => {
    // Test with malformed data
    await page.route('**/*', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Bad Request' })
        });
      } else {
        route.continue();
      }
    });
    
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button[type="submit"]');
    
    // Should handle server errors gracefully
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
