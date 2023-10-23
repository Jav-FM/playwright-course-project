import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { ProductsPage } from "../page-objects/ProductsPage";
import { Navigation } from "../page-objects/Navigation";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { LoginPage } from "../page-objects/LoginPage";
import { RegisterPage } from "../page-objects/RegisterPage";
import { DeliveryDetailsPage } from "../page-objects/DeliveryDetailsPage";
import { deliveryDetails } from "../data/deliveryDetails";
import { PaymentPage } from "../page-objects/PaymentPage";
import { paymentDetails } from "../data/paymentDetails";

test("New user full end-to-end test jorney", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.visit();
  await productsPage.sortByCheapest();
  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(1);
  await productsPage.addProductToBasket(2);

  const navigation = new Navigation(page);
  await navigation.goToCheckout();

  const checkout = new CheckoutPage(page);
  await checkout.removeCheapestProduct();
  await checkout.continueToCheckout();

  const login = new LoginPage(page);
  await login.goToRegister();

  const registerPage = new RegisterPage(page);
  const emailId = uuidv4();
  const email = emailId + "@tester.com";
  const password = uuidv4();
  await registerPage.signUpAsNewUser(email, password);

  const delivery = new DeliveryDetailsPage(page);
  await delivery.fillDeliveryDetails(deliveryDetails);
  await delivery.saveDetails();
  await delivery.continueToPayment();

  const payment = new PaymentPage(page);
  await payment.activateDiscount();
  await payment.fillPaymentDetails(paymentDetails);
  await payment.completePayment();
});
