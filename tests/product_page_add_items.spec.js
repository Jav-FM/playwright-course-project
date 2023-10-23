import { test, expect } from "@playwright/test";

test.skip("Product Page Add To Basket", async ({ page }) => {
  // Navigate to a url:
  await page.goto("localhost:2221");
  // Pause the test:
  //   await page.pause();
  // Locate an element:
  // In the Playwright inspector, select the locator icon and look for the item in the Chromium navigator:
  //   const addToBasketButton = page
  //     .locator("div")
  //     .filter({ hasText: /^499\$Add to Basket$/ })
  //     .getByRole("button");
  // *Another option for locator, but this will bring the five buttons:
  //   const addToBasketButton = page.getByRole("button", { name: "Add to Basket" });
  // And there is a thirt option using data-qa attribute in the element, and selecting the element like this:
  const addToBasketButton = page.locator('[data-qa="product-button"]').first();
  //This is the correcto way here because we are going to change the text
  // To use that one but using only de first element, we can add .first() at the end lile this:
  //   const addToBasketButton = page.getByRole("button", { name: "Add to Basket" }).first/();
  // A good practic is always to await the element:
  await addToBasketButton.waitFor();
  //Get the basket counter:
  const basketCounter = page.locator('[data-qa="header-basket-count"]');
  await basketCounter.waitFor();
  await expect(basketCounter).toHaveText("0");
  // Click in the button:
  await addToBasketButton.click();
  await expect(addToBasketButton).toHaveText("Remove from Basket");
  await expect(basketCounter).toHaveText("1");

  //Get and click checkout link
  const checkoutLink = page.getByRole("link", { name: "Checkout" });
  await checkoutLink.waitFor();
  await checkoutLink.click();

  //Confirm that now we are in basket section
  await page.waitForURL("/basket");
});
