const ical = require('node-ical');
const moment = require('moment');

async function getNextEvent(calendarUrl, eventName, lookoutDays) {
  try {
    const webEvents = await ical.async.fromURL(calendarUrl);
    let nextEvent;
    for(let i in webEvents){
      if(webEvents[i].summary.includes(eventName)) {
        nextEvent = getNextDate(webEvents[i], lookoutDays);
        if(nextEvent.summary){
          console.log(nextEvent);
          return nextEvent;
        }
      }
    }
  } catch(e) {
    console.log(e);
    return null;
  }
}
  
  // returns the next instance of an iCal @event within @lookoutDays of now
function getNextDate(event, lookoutDays) {
  if(event.type !== 'VEVENT') {
    return null;
  }

  let rangeStart = moment();
  let rangeEnd = moment().add(lookoutDays, 'days');

  let summary = null;
  let description = null;
  let startDate = moment(event.start);
  let endDate = moment(event.end);

  // No recurrences
  if (typeof event.rrule === 'undefined')
  {
    if (endDate.isBefore(rangeStart) || startDate.isAfter(rangeEnd)) { 
      return null;
    }
  }
  // Has recurrences
  else if (typeof event.rrule !== 'undefined')
  {
    // For recurring events, get the set of event start dates that fall within the range
    // of dates we're looking for.
    var dates = event.rrule.between(
      rangeStart.toDate(),
      rangeEnd.toDate(),
      true,
      function(date, i) {return true;}
    )

    if (event.recurrences != undefined)
    {
      for (var r in event.recurrences)
      {
        // Only add dates that weren't already in the range we added from the rrule so that 
        // we don't double-add those events.
        if (moment(new Date(r)).isBetween(rangeStart, rangeEnd) != true)
        {
          dates.push(new Date(r));
        }
      }
    }

    // Calculate the duration of the event for use with recurring events.
    var duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

    // Loop through the set of date entries to see which recurrences should be printed.
    for(var i in dates) {

      var date = dates[i];
      var curEvent = event;
      var curDuration = duration;

      startDate = moment(date);

      // Use just the date of the recurrence to look up overrides and exceptions (i.e. chop off time information)
      var dateLookupKey = date.toISOString().substring(0, 10);

      // For each date that we're checking, it's possible that there is a recurrence override for that one day.
      if ((curEvent.recurrences != undefined) && (curEvent.recurrences[dateLookupKey] != undefined))
      {
        curEvent = curEvent.recurrences[dateLookupKey];
        startDate = moment(curEvent.start);
        curDuration = parseInt(moment(curEvent.end).format("x")) - parseInt(startDate.format("x"));
      }

      // If there's a recurrence override for this date, skip it
      else if ((curEvent.exdate != undefined) && (curEvent.exdate[dateLookupKey] != undefined)) { continue; }

      // Set the end date from either the regular event or the recurrence override.
      endDate = moment(parseInt(startDate.format("x")) + curDuration, 'x');

      // If this recurrence ends before the start of the date range, or starts after the end of the date range, skip it
      if (endDate.isBefore(rangeStart) || startDate.isAfter(rangeEnd)) { continue; }

      summary = curEvent.summary;
      description = curEvent.description;
      break;
    }
  } 

  return summary == null ? {} : {
    'summary': summary,
    'description': description,
    'start': startDate.toDate(),
    'end': endDate.toDate(),
  };
}

module.exports = {
  getNextEvent: getNextEvent,
}