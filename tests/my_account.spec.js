import { test } from "@playwright/test";
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { getLoginToken } from "../api-calls/getLoginToken";
import { adminDetails } from "../data/userDetails";

test("My Account using cookie injection and mocking network request", async ({
  page,
}) => {
  await page.route("**/api/user**", async (route, request) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        message: "PLAYWRIGHT ERROR FROM MOCKING",
      }),
    });
  });
  const myAccount = new MyAccountPage(page);
  //This first visit wont have token, so it will return us to login page
  await myAccount.visit();
  const loginToken = await getLoginToken(
    adminDetails.username,
    adminDetails.password
  );
  await page.evaluate(
    ([loginTokenInsideBrowserCode]) => {
      document.cookie = `token=${loginTokenInsideBrowserCode}`;
    },
    [loginToken]
  );
  //This second visit will be with token so it will redirect us to myAccount
  await myAccount.visit();
  await myAccount.waitForPageHeading();
  await myAccount.waitForErrorMessage();
});
