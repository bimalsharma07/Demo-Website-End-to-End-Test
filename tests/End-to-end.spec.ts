import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
});

test('Login and checkout flow with validation', async ({ page }) => {
    // Perform Login
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Select filter (Low to High)
    await page.locator('select.product_sort_container').selectOption('lohi');

    // Add items to the cart
    await page.locator('#add-to-cart-sauce-labs-onesie').click();
    await page.locator('#add-to-cart-sauce-labs-fleece-jacket').click();

    // Verify items were added to the cart
    const cartCount = await page.locator('.shopping_cart_badge').textContent();
    expect(cartCount).toBe('2');

    // Proceed to checkout
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await page.locator('#checkout').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Fill checkout form
    await page.locator('#first-name').fill('John');
    await page.locator('#last-name').fill('Doe');
    await page.locator('#postal-code').fill('45000');
    await page.locator('#continue').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Complete order
    await page.locator('#finish').click();
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    // Validate confirmation message
    const confirmationMessage = await page.locator('.complete-text').textContent();
    expect(confirmationMessage).toContain('Your order has been dispatched');

    // Ensure the page is fully loaded before finishing test
    await page.waitForSelector('.complete-header', { state: 'visible' });
});
