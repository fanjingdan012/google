

const SCOPES = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://mail.google.com', // gmail
      'https://www.google.com/m8/feeds/', // contacts
      'https://www.googleapis.com/auth/calendar',// calendar
];
const CLIENT_ID = "573469226789-ujlfrkmv3dc6eugf3e8ii5o6eho2v5cg.apps.googleusercontent.com";
const REDIRECt_URI = 'postmessage';
const OAUTH_URL = 'https://accounts.google.com/o/oauth2/auth?client_id=' + CLIENT_ID + '&response_type=token&redirect_uri=' + encodeURIComponent(REDIRECt_URI) +
                    '&acces_type=online&include_granted_scopes=true&scope=' + SCOPES.join(' ') + '&origin=https%3A%2F%2Fmail.google.com';


export {SCOPES, CLIENT_ID, REDIRECt_URI, OAUTH_URL};