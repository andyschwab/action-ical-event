const core = require('@actions/core');
const github = require('@actions/github');
const icaltools = require('./icaltools');

async function run(production = true) {
  try {
    let iCalAddress, eventName, lookoutDays;

    if(production) {
      iCalAddress = core.getInput('ical-address');
      eventName = core.getInput('event-name');
      lookoutDays = core.getInput('lookout-days');
    } else {
      iCalAddress = "https://calendar.google.com/calendar/ical/ipfs.io_eal36ugu5e75s207gfjcu0ae84@group.calendar.google.com/public/basic.ics"
      eventName = "IPFS Weekly Call";
      lookoutDays = 30;
    }

    console.log(`
      Processing...
        iCal URL = ${iCalAddress}
        Event Name = ${eventName}
        Days to look ahead = ${lookoutDays}
      `);

    const event = icaltools.getNextEvent(iCalAddress, eventName, lookoutDays);
    
    if(production) {
      core.setOutput("summary", event.summary);
      core.setOutput("description", event.description);
      core.setOutput("start", event.start);
      core.setOutput("end", event.end);   
    }

    console.log(event);

    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

  } catch (error) {
    if(production) {
      core.setFailed(error.message);
    } else {
      console.log(error.message);
    }
  }
}

run()