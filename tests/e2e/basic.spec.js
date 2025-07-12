const { test, expect } = require('@playwright/test');

test.describe('CS Linker Basic Test', () => {
  test('should load the homepage and display the form', async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
    
    // Check that the page loads and has the expected title
    await expect(page).toHaveTitle(/Create Link/);
    
    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Create Link');
    
    // Check that the URL input field is visible
    await expect(page.locator('input[name="address"]')).toBeVisible();
    
    // Check that the submit button is visible
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    console.log('✅ Homepage loaded successfully!');
  });
});
