import { expect, test } from "@playwright/test";

test.describe("Admin demo login", () => {
  test("agency role reaches agency dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "대시보드 입장" }).click();
    await expect(page).toHaveURL(/\/agency$/);
    await expect(
      page.getByRole("heading", { name: "대행사 대시보드" }),
    ).toBeVisible();
  });

  test("advertiser role reaches advertiser dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("radio", { name: "광고주" }).check();
    await page.getByRole("button", { name: "대시보드 입장" }).click();
    await expect(page).toHaveURL(/\/advertiser$/);
    await expect(
      page.getByRole("heading", { name: "광고주 대시보드" }),
    ).toBeVisible();
  });
});
