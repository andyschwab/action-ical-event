const core = require('@actions/core');
const icaltools = require('./icaltools');

async function run() {
  try {
    let iCalAddress = core.getInput('ical-address');
    let eventName = core.getInput('event-name');
    let lookoutDays = core.getInput('lookout-days');

    console.log(`
        Processing...
          iCal URL = ${iCalAddress}
          Event Name = ${eventName}
          Days to look ahead = ${lookoutDays}
      `);

    const event = await icaltools.getNextEvent(iCalAddress, eventName, lookoutDays);

    console.log("Returned... ");

    for(let key in event) {
      core.setOutput(key, event[key].toString())
      console.log(`  ${key}: ${event[key]}`);
    }      

/*     core.setOutput('summary', event.summary);
    core.setOutput('description', event.description);
    core.setOutput('start', event.start.toString());
    core.setOutput('end', event.end.toString());
    
    console.log(`
      Returned...
        Summary: ${event.summary}
        Description: ${event.description}
        Start Date: ${event.start.toString()}
        End Date: ${event.end.toString()}
    `); */

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

  } catch (error) {
    core.setFailed(error.toString());
  }
}

run()