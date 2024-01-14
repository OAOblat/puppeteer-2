module.exports = {
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },

  getAttribute: async function (page, selector, attribute) {
    try {
      await page.waitForSelector(selector);
      const element = await page.$(selector);
      if (!element) {
        throw new Error(`Selector "${selector}" not found`);
      }
      const hasAttribute = await page.evaluate(
        (el, attr) => el.hasAttribute(attr),
        element,
        attribute
      );
      if (!hasAttribute) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(`Error in getAttribute: "${error}"`);
    }
  },

  choosingRandomAvailable: async function (
    page,
    sectionSelector,
    mainSelector,
    addSelector = null
  ) {
    try {
      await page.waitForSelector(sectionSelector);
      let elements = await page.$$(mainSelector);
      if (elements.length === 0 && addSelector) {
        await page.click(addSelector);
        await page.waitForSelector(mainSelector);
        elements = await page.$$(mainSelector);
      }

      if (elements.length === 0) {
        const seance = await page.$eval(
          ".buying__info-description",
          (link) => link.textContent
        );
        throw new Error(
          `There are no required seats for the selected session: ${seance}`
        );
      }

      const randomIndex = Math.floor(Math.random() * elements.length); //выбор любого доступного элемента
      await elements[randomIndex].click();
      return this.choosingRandomAvailable;
    } catch (error) {
      throw new Error(`Error in choosingRandomAvailable: "${error}"`);
    }
  },
};
