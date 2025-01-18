/**
 * @file datetime.js
 * @description 
 * @author 
 * @copyright 
 */


// Client ID and API key from the Developer Console
const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

/**
 * Initialize the Google Calendar API
 */
function initializeGoogleCalendar() {
    gapiLoaded();
    gisLoaded();
}

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 * Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        await listUpcomingEvents();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 * Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar.
 */
async function listUpcomingEvents() {
    try {
        const response = await gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
        });

        const events = response.result.items;
        const eventContainer = document.querySelector('.calendar-container');
        
        if (!events || events.length === 0) {
            eventContainer.innerHTML = 'No upcoming events found.';
            return;
        }

        // Render events
        eventContainer.innerHTML = events.map(event => {
            const start = event.start.dateTime || event.start.date;
            return `
                <div class="event-item">
                    <span class="event-time">${formatEventTime(start)}</span>
                    <span class="event-title">${event.summary}</span>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Error fetching calendar events:', err);
        document.querySelector('.calendar-container').innerHTML = 'Error fetching calendar events.';
    }
}

function formatEventTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Export functions for use in HTML
window.handleAuthClick = handleAuthClick;
window.handleSignoutClick = handleSignoutClick;
window.initializeGoogleCalendar = initializeGoogleCalendar;