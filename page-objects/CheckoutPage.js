import { expect } from "@playwright/test";

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.removeButtons = page.locator('[data-qa="basket-card-remove-item"]');
    this.continueToCheckoutButton = page.locator(
      '[data-qa="continue-to-checkout"]'
    );
  }

  removeCheapestProduct = async () => {
    //Review if any basket card exists
    await this.basketCards.first().waitFor();
    const itemsBeforeRemoval = await this.basketCards.count();
    await this.basketItemPrice.first().waitFor();
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    // Consoling all the price texts, it returned:  [ '499$', '599$', '320$' ]
    console.warn({ allPriceTexts });
    // Maping to remove the $ symbol and transform to number:
    const justNumbers = allPriceTexts.map((element) => {
      const withoutDollarSign = element.replace("$", "");
      return parseInt(withoutDollarSign);
    });
    // Identifying smaller number:
    const smallerPrice = Math.min(...justNumbers);
    // Get the index of the smaller price:
    const smallestPriceIndex = justNumbers.indexOf(smallerPrice);
    // Getting the remove button for the smallest price:
    const smallestRemoveButton = this.removeButtons.nth(smallestPriceIndex);
    await smallestRemoveButton.waitFor();
    // Deleting the smallest price:
    await smallestRemoveButton.click();
    // Corroborate that now we have -1 items
    await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/, { timeout: 3000 });
  };
}
