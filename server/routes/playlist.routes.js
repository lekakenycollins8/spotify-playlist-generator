const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');

router.post('/', async (req, res) => {
    const { access_token, track_uris } = req.body;
    const spotifyApi = createSpotifyClient();
    spotifyApi.setAccessToken(access_token);

    try {
        // Get user's profile
        const { body: user } = await spotifyApi.getMe();

        // Create a new playlist
        const { body: playlist } = await spotifyApi.createPlaylist(user.id, {
            name: `My Top Tracks - ${new Date().toLocaleDateString()}`,
            public: true,
        });

        // Add tracks to the playlist
        await spotifyApi.addTracksToPlaylist(playlist.id, track_uris);
        res.json({ url: playlist.external_urls.spotify });
    } catch (err) {
        console.error('Playlist Creation error:', err);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

module.exports = router;