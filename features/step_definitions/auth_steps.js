const { Given, When, Then } = require('cucumber');
const {
    clickByText,
    fillByLabel,
    fillTypeaheadByLabel,
    loginAs,
    shouldBeLoggedInAs,
    takeScreenshot,
    userExists,
    waitFor
} = require('../support/actions');


Given('I am registered as {string}', async (email) => {
    await userExists(email);
});

When('I log in as {string}', async (email) => {
    return await loginAs(email);
});

When(/I fill in a new registration for "([^"]+)"(?: except "([^"]+)")?/, async (email,except) => {
    await waitFor('.navbar');
    await clickByText("Register");
    if (except != "First name" ) await fillByLabel("First name","Bob");
    if (except != "Last name" ) await fillByLabel("Last name","Marshall");
    if (except != "Email" ) await fillByLabel("Email",email);
    if (except != "Password" ) await fillByLabel("Password","secret");
    if (except != "Country" ) {
        await fillTypeaheadByLabel("Country","United States of America")
        if (except != "State, province, or territory") {
            await fillTypeaheadByLabel("State, province, or territory","New York")
        }
        if (except != "Postal code") {
            await fillByLabel("Postal code","12943")
        }
    }
})

When('I fill in a modified profile', async () => {
    await fillByLabel("First name","Herbert")
    await takeScreenshot()
    await fillByLabel("Last name","Clark")
    await takeScreenshot()
    await fillByLabel("Email","hclark@example.com")
    await takeScreenshot()
    await fillTypeaheadByLabel("Country of residence","Canada")
    await takeScreenshot()
    await fillTypeaheadByLabel("State, province, or territory","Quebec")
    await takeScreenshot()
    await fillByLabel("Postal code","H2T 2M2")
    await takeScreenshot()
})

When('I register as a {string}', async (email) => {
    await fillInRegistration(email)
    await clickByText("Register","//button");
});

Then('I should be logged in as {string}', async(email) => {
    return await shouldBeLoggedInAs(email);
});
