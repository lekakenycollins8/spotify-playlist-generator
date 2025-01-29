import { useState, useEffect, useCallback } from 'react';
import useSpotify from '../hooks/useSpotify';
import TrackCard from '../components/TrackCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tracks, setTracks] = useState([]);
    const [timeRange, setTimeRange] = useState('short_term');
    const [loading, setLoading] = useState(true);
    const { getTopTracks, createPlaylist } = useSpotify();
    const navigate = useNavigate();

    const memoizedGetTopTracks = useCallback(
        async (timeRange, limit) => {
            return await getTopTracks(timeRange, limit);
        },
        [getTopTracks]
    );

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = sessionStorage.getItem('spotify_access_token');
            const tokenExpiry = sessionStorage.getItem('spotify_token_expiry');

            if (!accessToken) {
                navigate('/');
                return false;
            }

            // Check if token is expired
            if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
                console.log('Token expired, redirecting to login');
                sessionStorage.clear();
                navigate('/');
                return false;
            }

            return true;
        };

        const fetchTracks = async () => {
            if (!checkAuth()) return;

            setLoading(true);
            try {
                const data = await memoizedGetTopTracks(timeRange, 6);
                setTracks(data);
            } catch (error) {
                console.error('Track fetch error:', error);
                if (error.response?.status === 401) {
                    // Token invalid or expired
                    sessionStorage.clear();
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [timeRange, navigate, memoizedGetTopTracks]);

    const handleCreatePlaylist = async () => {
        if (tracks.length === 0) {
            alert('No tracks available to create playlist');
            return;
        }

        const accessToken = sessionStorage.getItem('spotify_access_token');
        if (!accessToken) {
            navigate('/');
            return;
        }

        try {
            const trackUris = tracks.map((track) => track.uri);
            const playlistUrl = await createPlaylist(accessToken, trackUris);
            window.open(playlistUrl, '_blank');
        } catch (error) {
            console.error('Playlist creation error:', error);
            if (error.response?.status === 401) {
                sessionStorage.clear();
                navigate('/');
            } else {
                alert('Failed to create playlist. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Loading your top tracks...</h2>
                    <p className="text-gray-600">Please wait</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            <h1 className='text-2xl font-semibold'>Your Top Tracks</h1>
            <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className='mt-4 px-4 py-2 bg-gray-100 rounded-lg'
            >
                <option value='short_term'>Last 4 weeks</option>
                <option value='medium_term'>Last 6 months</option>
                <option value='long_term'>All time</option>
            </select>
            <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {tracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                ))}
            </div>
            <button
                onClick={handleCreatePlaylist}
                className='mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                disabled={tracks.length === 0}
            >
                Create Playlist
            </button>
        </div>
    );
};

export default Dashboard;