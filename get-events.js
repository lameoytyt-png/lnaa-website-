// Netlify serverless function: fetches the LNAA Google Calendar's public iCal feed
// server-side (no browser CORS restrictions apply here) and returns the raw feed
// to the website. The website's own JavaScript then parses it into events.

const ICAL_URL = 'https://calendar.google.com/calendar/ical/emonterroso%40lnaa.academy/public/basic.ics';

exports.handler = async function () {
  try {
    const response = await fetch(ICAL_URL);

    if (!response.ok) {
      return {
        statusCode: 502,
        body: 'Failed to fetch calendar feed: ' + response.status,
      };
    }

    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        // Cache for 5 minutes so we're not hammering Google's servers on every visit,
        // while still keeping updates feeling close to immediate.
        'Cache-Control': 'public, max-age=300',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error fetching calendar: ' + err.message,
    };
  }
};
