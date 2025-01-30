const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');

router.post('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    const spotifyApi = createSpotifyClient();
    spotifyApi.setAccessToken(accessToken);
    const { track_uris, playlistName, public: publicPlaylist, playlistDescription } = req.body;
    if (!track_uris || !Array.isArray(track_uris) || track_uris.length === 0) {
        return res.status(400).json({ error: 'Invalid track_uris in request body' });
    }
    try {
        // Get user's profile
        const { body: user } = await spotifyApi.getMe();

        // Create a new playlist
        const { body: playlist } = await spotifyApi.createPlaylist(user.id, {
            name: playlistName || `My Top Tracks - ${new Date().toLocaleDateString()}`,
            public: publicPlaylist !== undefined ? publicPlaylist : true,
            description: playlistDescription || '',
        });

        // Add tracks to the playlist
        await spotifyApi.addTracksToPlaylist(playlist.id, track_uris);
        res.json({ url: playlist.external_urls.spotify });
    } catch (err) {
        console.error('Playlist Creation error:', err); // Log full error object
        console.error('Full error object:', err); // Log full error object
        if (err.body && err.body.error) {
            return res.status(500).json({ error: `Spotify API Error: ${err.body.error.message}` });
        }
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

module.exports = router;