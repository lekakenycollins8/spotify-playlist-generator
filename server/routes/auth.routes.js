const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');
const dotenv = require('dotenv');
dotenv.config();

//scopes required by app
const SCOPES = ['user-top-read', 'user-read-recently-played', 'user-read-playback-state', 'user-modify-playback-state', 'playlist-modify-public', 'playlist-modify-private'];

//login redirect to spotify auth
router.get('/login', (req, res) => {
    console.log('Login route accessed');
    const spotifyApi = createSpotifyClient();
    const authorizeURL = spotifyApi.createAuthorizeURL(SCOPES);
    console.log('Redirecting to Spotify authorization URL:', authorizeURL);
    res.redirect(authorizeURL);
});

//callback route after login: exchange code for access token
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    console.log('Auth callback received with code:', code);

    if (!code) {
        console.error('No code received in callback');
        return res.redirect(`${process.env.FRONTEND_URI}/error`);
    }

    const spotifyApi = createSpotifyClient();
    
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        console.log('Token grant successful');
        
        const { access_token, refresh_token, expires_in } = data.body;
        console.log('Access token received:', access_token.substring(0, 10) + '...');
        console.log('Refresh token received:', refresh_token.substring(0, 10) + '...');
        console.log('Expires in:', expires_in);
        
        const queryParams = new URLSearchParams({
            access_token,
            refresh_token,
            expires_in
        }).toString();
        
        res.redirect(`${process.env.FRONTEND_URI}/callback?${queryParams}`);
    } catch (error) {
        console.error('Authorization error:', error);
        res.redirect(`${process.env.FRONTEND_URI}/error`);
    }
});

router.post('/refresh', async (req, res) => {
    const { refresh_token } = req.body;
    console.log('Refresh token request received');

    if (!refresh_token) {
        console.error('No refresh token provided');
        return res.status(400).json({ error: 'Refresh token required' });
    }

    const spotifyApi = createSpotifyClient();
    spotifyApi.setRefreshToken(refresh_token);

    try {
        const data = await spotifyApi.refreshAccessToken();
        console.log('Token refresh successful');
        const { access_token, expires_in } = data.body;
        res.json({ access_token, expires_in });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

module.exports = router;