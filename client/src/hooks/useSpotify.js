import axios from 'axios';

const useSpotify = () => {
    const getTopTracks = async (access_token, timeRange) => {
        try {
            const response = await axios.get('http://localhost:8080/api/tracks', {
                params: { timeRange: timeRange },
                headers: { Authorization: `Bearer ${access_token}` },
            });
        return response.data;
        } catch (error) {
            console.error('Track fetch error:', error);
            throw new Error('Failed to fetch top tracks');
        }
    };

    const createPlaylist = async (accessToken, trackUris) => {
        try {
            const response = await axios.post('http://localhost:8080/api/playlist',
                { access_token: accessToken, track_uris: trackUris },
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data.url;
        } catch (error) {
            console.error('Playlist creation error:', error);
            throw new Error('Failed to create playlist');
        }
    };

    return { getTopTracks, createPlaylist };
};

export default useSpotify;