const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const {
  getAttribute,
  choosingRandomAvailable,
} = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given(
  "user is on the ticket booking page and selects an available session",
  async function () {
    await this.page.goto("http://qamid.tmweb.ru/client/index.php");
    await choosingRandomAvailable(
      this.page,
      ".movie",
      ".movie-seances__time:not(.acceptin-button-disabled)",
      ".page-nav__day:not(.page-nav__day_today)"
    );
  }
);

When("user chooses one available seat for booking", async function () {
  await choosingRandomAvailable(
    this.page,
    ".buying-scheme",
    "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled)"
  );
});

Then("the booking button should be available", async function () {
  const isButtonDisabled = await getAttribute(this.page, "button", "disabled");
  expect(isButtonDisabled).to.equal(false);
});

When("user chooses two available seats for booking", async function () {
  await choosingRandomAvailable(
    this.page,
    ".buying-scheme",
    "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled)"
  );

  await choosingRandomAvailable(
    this.page,
    ".buying-scheme",
    "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled):not(.buying-scheme__chair_selected)"
  );
});

Then("the booking button should still be available", async function () {
  const isButtonDisabled = await getAttribute(this.page, "button", "disabled");
  expect(isButtonDisabled).to.equal(false);
});

When("user chooses a disabled seat for booking", async function () {
  await choosingRandomAvailable(
    this.page,
    ".buying-scheme",
    ".buying-scheme__chair_disabled"
  );
});

Then("the booking button should be disabled", async function () {
  const isButtonDisabled = await getAttribute(this.page, "button", "disabled");
  expect(isButtonDisabled).to.equal(true);
});
