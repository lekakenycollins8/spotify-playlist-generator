const SpotifyWebApi = require('spotify-web-api-node');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = require('./env');

const createSpotifyClient = () => {
    return new SpotifyWebApi({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
    });
};

module.exports = createSpotifyClient;