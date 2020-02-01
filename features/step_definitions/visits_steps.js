const { Given, When, Then } = require('cucumber');
const {
    clickByXPath,
    fillByLabel,
    fillTypeaheadByLabel,
    formatDateForFill,
    formatDateForDisplay,
    relativeDate,
    shouldSeeText,
    takeScreenshot,
    visitExists,
    waitFor
} = require('../support/actions');
const scope = require('../support/scope');
const { toLocalDate } = require('../../test/support/util')
const visitRowSelector = (startOn,origin,destination) => {
    return `//li[contains(.,'${formatDateForDisplay(relativeDate(startOn))}') and contains(.,'${origin}') ` +
        `and contains(.,'${destination}')]`
}
const visitRowText = (startOn,origin,destination) => {
    return `${formatDateForDisplay(relativeDate(startOn))}: From ${origin} To ${destination}`
}

Given(/I have registered a visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"/,
    async (startOn, originName, destinationName) => {
        await visitExists({
            startOnDate: toLocalDate(relativeDate(startOn)),
            origin: (scope.models.originPlace.filter(p => p.name == originName)[0]._id),
            destinations: scope.models.destinationPlace.filter(p => p.name == destinationName),
            user: scope.context.user.id
        })
    }
)

When(
    /^I wait for my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)" to disappear$/,
    async (when,from,to) => {
        const selector = `//div[contains(@class,'visits-list') and not(.${visitRowSelector(when,from,to)})]`
        await waitFor(selector)
    }
)

When('I delete the visit to {string}', async (visit) => {
     await clickByXPath(`//button[contains(..,'${visit}') and contains(.,"Remove")]`)
     await waitFor(`//div[contains(@class,'visits-list') and not(contains(.//li,'${visit}'))]`)
});

When(/I fill in a visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"(?: except "([^"]+)")?/,
    async (startOn,origin,destination,except) => {
        const startOnDate = relativeDate(startOn)
        await waitFor('form')
        if ( except != "Date of visit" ) await fillByLabel("Date of visit",formatDateForFill(startOnDate))
        if ( except != "Start time" ) await fillByLabel("Start time",'08:00AM')
        if ( except != "Starting point" ) await fillTypeaheadByLabel("Starting point",origin)
        if ( except != "Number of people in group" ) await fillByLabel("Number of people in group",'4')
        if ( except != "Duration in nights" ) await fillByLabel("Duration in nights",'0')
        await fillTypeaheadByLabel("Destinations",destination)
});

When(
    /^I click "([^"]+)" for my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (button,when,from,to) => {
        await waitFor('.visits-list')
        await clickByXPath(visitRowSelector(when,from,to)+`//button[contains(text(),'${button}')]`)
    }
)

Then(
    /^I should( not)? see my visit for (today|tomorrow) from "([^"]+)" to "([^"]+)"$/,
    async (not,startOn,origin,destination) => {
        await waitFor('.visits-list')
        await shouldSeeText(".visit-label", not, visitRowText(startOn,origin,destination));
});