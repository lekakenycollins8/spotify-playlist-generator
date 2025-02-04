const express = require('express');
const router = express.Router();
const createSpotifyClient = require('../config/spotify.config');
const retryOperation = require('../utils/retry');

router.get('/', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    const spotifyApi = createSpotifyClient();
    spotifyApi.setAccessToken(accessToken);
    
    const { timeRange = 'short_term', limit = 600 } = req.query;
    
    try {
        const { body } = await retryOperation(async () => {
            return await spotifyApi.getMyTopTracks({ 
                time_range: timeRange,
                limit: parseInt(limit),
                offset: 20 * (parseInt(req.query.page) || 0)
            });
        });
        
        res.json(body.items);
    } catch (error) {
        console.error('Spotify API error:', error);
        
        if (error.statusCode === 401) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'Service temporarily unavailable',
                message: 'Connection to Spotify failed. Please try again.'
            });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;