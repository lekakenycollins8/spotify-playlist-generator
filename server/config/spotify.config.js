const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config();

const createSpotifyClient = () => {
    return new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        timeout: 15000,  // Set timeout through options
        headers: {
            'Connection': 'keep-alive'
        }
    });
};

module.exports = createSpotifyClient;