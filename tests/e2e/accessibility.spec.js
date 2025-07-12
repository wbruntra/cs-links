const { test, expect } = require('@playwright/test');

test.describe('UI and Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Test tab navigation through form elements
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="url"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
    
    // Test form submission with Enter key
    await page.locator('input[name="url"]').focus();
    await page.fill('input[name="url"]', 'https://example.com');
    await page.keyboard.press('Enter');
    
    // Should submit the form
    await page.waitForURL(/\/link\/\w+/);
  });

  test('should have proper ARIA labels and semantic HTML', async ({ page }) => {
    // Check for proper form labels
    const urlInput = page.locator('input[name="url"]');
    await expect(urlInput).toHaveAttribute('type', 'url');
    await expect(urlInput).toHaveAttribute('required');
    
    // Check for proper button semantics
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Check for proper headings hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that elements are still visible and usable
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test form functionality on mobile
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    
    // Check that result page is also mobile-friendly
    await expect(page.locator('.short-link')).toBeVisible();
    await expect(page.locator('#copy-btn')).toBeVisible();
  });

  test('should handle different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },  // iPhone 5
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check that main elements are visible
      await expect(page.locator('input[name="url"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check that layout doesn't break
      const urlInput = page.locator('input[name="url"]');
      const boundingBox = await urlInput.boundingBox();
      expect(boundingBox.width).toBeGreaterThan(0);
      expect(boundingBox.height).toBeGreaterThan(0);
    }
  });

  test('should maintain focus management', async ({ page }) => {
    // Fill form and submit
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    
    // Check that focus is managed properly on result page
    // The copy button should be focusable
    await page.keyboard.press('Tab');
    await expect(page.locator('#copy-btn')).toBeFocused();
  });

  test('should provide proper error feedback', async ({ page }) => {
    // Submit invalid URL
    await page.fill('input[name="url"]', 'invalid-url');
    await page.click('button[type="submit"]');
    
    // Check that error message is visible and accessible
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    
    // Error should be announced to screen readers
    await expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  test('should handle high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    
    // Elements should still be visible
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Test with light mode too
    await page.emulateMedia({ colorScheme: 'light' });
    
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // App should still function normally
    await page.fill('input[name="url"]', 'https://example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/link\/\w+/);
    await expect(page.locator('.short-link')).toBeVisible();
  });

  test('should load quickly and show loading states', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Check that critical elements are visible immediately
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle form validation messages properly', async ({ page }) => {
    // Test HTML5 validation
    const urlInput = page.locator('input[name="url"]');
    await urlInput.fill('invalid-url');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check validation message
    const validationMessage = await urlInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
    
    // Fix the URL and try again
    await urlInput.fill('https://example.com');
    await page.click('button[type="submit"]');
    
    // Should proceed successfully
    await page.waitForURL(/\/link\/\w+/);
  });
});
