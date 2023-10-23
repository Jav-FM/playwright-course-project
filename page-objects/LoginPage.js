export class LoginPage {
  constructor(page) {
    this.page = page;
    this.registerButton = page.locator('[data-qa="go-to-signup-button"]');
  }

  goToRegister = async () => {
    await this.registerButton.waitFor();
    await this.registerButton.click();
    await this.page.waitForURL(/\/signup/, { timeout: 3000 });
  };
}
