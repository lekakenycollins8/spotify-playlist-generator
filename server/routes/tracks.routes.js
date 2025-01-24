const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');

//fetch user's top tracks
router.get('/', async (req, res) => {
    const { access_token, time_range } = req.query;
    const spotifyApi = createSpotifyClient();
    spotifyApi.setAccessToken(access_token);

    try {
        const { body } = await spotifyApi.getMyTopTracks({ time_range, limit: 50 });
        res.json(body.items);
    } catch (error) {
        console.error('Spotify API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;