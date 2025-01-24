const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');

//scopes required by app
const SCOPES = ['user-top-read', 'user-read-recently-played', 'user-read-playback-state', 'user-modify-playback-state', 'playlist-modify-public', 'playlist-modify-private'];

//login redirect to spotify auth
router.get('/login', (req, res) => {
    const spotifyApi = createSpotifyClient();
    const authorizeURL = spotifyApi.createAuthorizeURL(SCOPES);
    res.redirect(authorizeURL);
});

//callback route after login: exchange code for access token
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    const spotifyApi = createSpotifyClient();

    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;

        //redirect to frontend with tokens
        res.redirect(`${process.env.FRONTEND_URI}/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
        console.error('Spotify authorization error:', error);
        res.redirect(`${process.env.FRONTEND_URI}/error`);
    }
});

module.exports = router;