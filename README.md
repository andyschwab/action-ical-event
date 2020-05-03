# Action: iCal Event Detector 

This action references a public iCal resource and searches for the next instance, from now, of a target event. Returns the following as output to be used in additional action steps:

* `summary` - the summary (or title) of the event
* `decription` - the full event description
* `start` - in format: 2013-03-01T00:00:00+01:00
* `end` - in format: 2013-03-01T00:00:00+01:00

## Inputs

### `ical-address`

**Required** The full URL to a public iCal resource. 

The iCal output of a publically shared Google Calendar can be accessed using the calendar's resource address:

"https://calendar.google.com/calendar/ical/**calendar-resource-address**/public/basic.ics"

### `event-summary`

**Required** The event summary (the title). Matches any event that contains _at least_ the `event-summary` input value.

### `lookahead-days`

**Required** The number of days from today to look ahead to find a match.

Default: 365

## Outputs

### `summary`

The event summary, which is the title in Google Calendar

### `description`

The detailed event description

### `start`

Event start date in format: 2013-03-01T00:00:00+01:00

### `end`

Event end datetime in format: 2013-03-01T00:00:00+01:00

## Example usage

uses: andyschwab/action-ical-event-detector
id: my-event
with:
  event-name: 'Happy Birthday to Me'
  
