import { expect } from "@playwright/test";

export class PaymentPage {
  constructor(page) {
    this.page = page;
    //This element is inside and iframe, so we need to locate the iframe first
    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');
    this.discountInput = page.getByPlaceholder("Discount code");
    this.submitDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]'
    );
    this.discountActivatedText = page.locator(
      '[data-qa="discount-active-message"]'
    );
    this.totalPrice = page.locator('[data-qa="total-value"]');
    this.totalPriceWithDiscount = page.locator(
      '[data-qa="total-with-discount-value"]'
    );
    this.creditCardOwnerInput = page.getByPlaceholder("Credit card owner");
    this.creditCardNumberInput = page.getByPlaceholder("Credit card number");
    this.creditCardValidUntilInput = page.getByPlaceholder("Valid until");
    this.creditCardCvcInput = page.getByPlaceholder("Credit card CVC");
    this.payButton = page.locator('[data-qa="pay-button"]');
  }

  activateDiscount = async () => {
    //Check that an element is not showing:
    expect(await this.discountActivatedText.isVisible()).toBe(false);
    expect(await this.totalPriceWithDiscount.isVisible()).toBe(false);
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText();
    await this.discountInput.waitFor();
    // To fill a laggy input
    // Option 1: using .fill() with await expect()
    await this.discountInput.fill(code);
    await expect(this.discountInput).toHaveValue(code);
    // Option 2 for laggy inputs: slow typing
    // await this.discountInput.focus();
    // await this.page.keyboard.type(code, { delay: 1000 });
    // expect(await this.discountInput.inputValue()).toBe(code);
    await this.submitDiscountButton.waitFor();
    await this.submitDiscountButton.click();
    await this.discountActivatedText.waitFor();
    await this.totalPrice.waitFor();
    const totalPriceInnerText = await this.totalPrice.innerText();
    const totalPriceOnlyNumber = parseInt(totalPriceInnerText.replace("$", ""));
    await this.totalPriceWithDiscount.waitFor();
    const totalPriceWithDiscountInnerText =
      await this.totalPriceWithDiscount.innerText();
    const totalPriceWithDiscountOnlyNumber = parseInt(
      totalPriceWithDiscountInnerText.replace("$", "")
    );
    expect(totalPriceOnlyNumber).toBeGreaterThan(
      totalPriceWithDiscountOnlyNumber
    );
  };

  fillPaymentDetails = async ({ owner, number, validUntil, cvc }) => {
    await this.creditCardOwnerInput.waitFor();
    await this.creditCardOwnerInput.fill(owner);
    await this.creditCardNumberInput.waitFor();
    await this.creditCardNumberInput.fill(number);
    await this.creditCardValidUntilInput.waitFor();
    await this.creditCardValidUntilInput.fill(validUntil);
    await this.creditCardCvcInput.waitFor();
    await this.creditCardCvcInput.fill(cvc);
  };

  completePayment = async () => {
    await this.payButton.waitFor();
    await this.payButton.click();
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
  };
}
