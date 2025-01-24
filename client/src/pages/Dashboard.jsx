import { useState, useEffect } from 'react';
import useSpotify from '../hooks/useSpotify';
import TrackCard from '../components/TrackCard';

const Dashboard = () => {
    const [ tracks, setTracks ] = useState([]);
    const [ timeRange, setTimeRange ] = useState('short_term');
    const { getTopTracks, createPlaylist } = useSpotify();
    const access_token = window.sessionStorage.getItem('spotify_access_token');

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const data = await getTopTracks(access_token, timeRange);
                setTracks(data);
            } catch (error) {
                console.error('Track fetch error:', error);
            }
        };
        fetchTracks();
    }, [timeRange]);

    const handleCreatePlaylist = async () => {
        const trackUris = tracks.map((track) => track.uri);
        try {
            const playlistUrl = await createPlaylist(access_token, trackUris);
            window.open(playlistUrl, '_blank');
        } catch (error) {
            console.error('Playlist creation error:', error);
            alert('Failed to create playlist. Please try again.');
        }
    };

    return (
        <div className='p-6 max-w-4xl mx-auto'>
            {/* filter dropdown */}
            <div>
                <h1 className='text-2xl font-semibold'>Top Tracks</h1>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className='mt-4 px-4 py-2 bg-gray-100 rounded-lg'
                >
                    <option value='short_term'>Last 4 weeks</option>
                    <option value='medium_term'>Last 6 months</option>
                    <option value='long_term'>All time</option>
                </select>
            </div>
            {/* track cards */}
            <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {tracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                ))}
            </div>
            {/* create playlist button */}
            <button
                onClick={handleCreatePlaylist}
                className='mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            >
                Create Playlist
            </button>
        </div>
    );
};

export default Dashboard;