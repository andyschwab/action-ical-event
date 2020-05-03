const core = require('@actions/core');
const icaltools = require('./icaltools');

async function run() {
  try {
    let iCalAddress = core.getInput('ical-address');
    let eventSummary = core.getInput('event-summary');
    let lookoutDays = core.getInput('lookout-days');

    console.log(`
        Processing...
          iCal URL = ${iCalAddress}
          Event Name = ${eventSummary}
          Days to look ahead = ${lookoutDays}
      `);

    const event = await icaltools.getNextEvent(iCalAddress, eventSummary, lookoutDays);

    console.log("Returned... ");

    for(let key in event) {
      core.setOutput(key, event[key])
      console.log(`  ${key}: ${event[key]}`);
    }      

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

  } catch (error) {
    core.setFailed(error.toString());
  }
}

run()