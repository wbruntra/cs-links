const { test, expect } = require('@playwright/test');

test.describe('Basic Homepage Test', () => {
  test('should load the homepage', async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    
    // Check if page loaded
    await expect(page).toHaveTitle(/CS Linker/);
    
    // Check if main elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="url"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('✅ Homepage loaded successfully!');
  });
});
