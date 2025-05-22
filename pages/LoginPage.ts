import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
    await this.page.waitForTimeout(3000); // Wait for 2 seconds to allow the page to load
    
  }

  async getError() {
    return this.page.locator('[data-test="error"]').textContent();
  }
}
