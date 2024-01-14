const { getAttribute, choosingRandomAvailable } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
});

afterEach(() => {
  page.close();
});

describe("tmweb.ru tests", () => {
  beforeEach(async () => {
    // выбор любого доступного сеанса (в случае отстутствия на сегодняшний день, поиск ведется в последующем дне)
    await choosingRandomAvailable(
      page,
      ".movie",
      ".movie-seances__time:not(.acceptin-button-disabled)",
      ".page-nav__day:not(.page-nav__day_today)"
    );
  });

  test("Check availability of booking button when reserving one available seat", async () => {
    //выбор любого незабронированного места
    await choosingRandomAvailable(
      page,
      ".buying-scheme",
      "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled)"
    );
    const actual = await getAttribute(page, "button", "disabled");
    expect(actual).toEqual(false);
  });

  test("Check availability of booking button when reserving two available seats'", async () => {
    //выбор первого незабронированного места
    await choosingRandomAvailable(
      page,
      ".buying-scheme",
      "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled)"
    );
    //выбор второго незабронированного и невыбранного в первый раз места
    await choosingRandomAvailable(
      page,
      ".buying-scheme",
      "div > span:not(.buying-scheme__chair_taken):not(.buying-scheme__chair_disabled):not(.buying-scheme__chair_selected)"
    );
    const actual = await getAttribute(page, "button", "disabled");
    expect(actual).toEqual(false);
  });

  test("Check if disabled seat cannot be booked'", async () => {
    //выбор любого недоступного для бронирования места
    await choosingRandomAvailable(
      page,
      ".buying-scheme",
      ".buying-scheme__chair_disabled"
    );
    const actual = await getAttribute(page, "button", "disabled");
    expect(actual).toEqual(true);
  });
});
