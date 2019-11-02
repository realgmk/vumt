// Dependencies
const { After, Before, AfterAll } = require('cucumber');
const mongoose = require('../db/mongoose');
const {
  Visit
} = require('../models');
const scope = require('./support/scope');

Before(async () => {
  await Visit.remove({});
});

After(async () => {
  // Here we check if a scenario has instantiated a browser and a current page
  if (scope.browser && scope.context.currentPage) {
    // if it has, find all the cookies, and delete them
    const cookies = await scope.context.currentPage.cookies();
    if (cookies && cookies.length > 0) {
      await scope.context.currentPage.deleteCookie(...cookies);
    }
    // close the web page down
    await scope.context.currentPage.close();
    // wipe the context's currentPage value
    scope.context.currentPage = null;
  }
});

AfterAll(async () => {
  // If there is a browser window open, then close it
  if (scope.browser) await scope.browser.close();
  scope.server.shutdown(() => console.log('\nServer is shut down'));
  mongoose.disconnect();
});