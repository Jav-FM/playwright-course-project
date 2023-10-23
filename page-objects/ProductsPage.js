import { expect } from "@playwright/test";
import { Navigation } from "./Navigation";
import { isDesktopViewport } from "../util/isDesktopViewport";

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.addButtons = page.locator('[data-qa="product-button"]');
    this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
    this.productTitles = page.locator('[data-qa="product-title"]');
  }

  visit = async () => {
    await this.page.goto("/");
  };

  addProductToBasket = async (productIndex) => {
    const addButton = this.addButtons.nth(productIndex);
    await addButton.waitFor();
    await expect(addButton).toHaveText("Add to Basket");
    const navigation = new Navigation(this.page);
    let basketCountBeforeAdding;
    // only desktop viewport
    if (isDesktopViewport(this.page)) {
      basketCountBeforeAdding = await navigation.getBasketCount();
    }

    await addButton.click();
    await expect(addButton).toHaveText("Remove from Basket");
    // only desktop viewport
    if (isDesktopViewport(this.page)) {
      const basketCountAfterAdding = await navigation.getBasketCount();
      expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
    }
  };

  sortByCheapest = async () => {
    await this.sortDropdown.waitFor();
    // get initial order of products
    await this.productTitles.first().waitFor();
    const productTitlesBeforeSorting = await this.productTitles.allInnerTexts();
    // sort the products
    await this.sortDropdown.selectOption("price-asc");
    // get new order and corroborate that the sort was executed
    const productTitlesAfterSorting = await this.productTitles.allInnerTexts();
    expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting);
  };
}
