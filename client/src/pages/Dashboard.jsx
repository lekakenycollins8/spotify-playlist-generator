import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSpotify from "../hooks/useSpotify";
import TrackCard from "../components/TrackCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [playlistName, setPlaylistName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { getTopTracks, createPlaylist } = useSpotify();
  const navigate = useNavigate();

  // Adjust getTopTracks to accept an offset
  const memoizedGetTopTracks = useCallback(
    async (timeRange, limit, offset) => {
      return await getTopTracks(timeRange, limit, offset);
    },
    [getTopTracks]
  );

  // Track selection handler
  const handleToggleTrack = (trackId) => {
    setSelectedTracks((prevSelected) =>
      prevSelected.includes(trackId)
        ? prevSelected.filter((id) => id !== trackId)
        : [...prevSelected, trackId]
    );
  };

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = sessionStorage.getItem("spotify_access_token");
      const tokenExpiry = sessionStorage.getItem("spotify_token_expiry");

      if (!accessToken) {
        navigate("/");
        return false;
      }

      if (tokenExpiry && Date.now() > Number.parseInt(tokenExpiry)) {
        console.log("Token expired, redirecting to login");
        sessionStorage.clear();
        navigate("/");
        return false;
      }
      return true;
    };

    const fetchTracks = async () => {
      if (!checkAuth()) return;

      setLoading(true);
      try {
        const data = await memoizedGetTopTracks(timeRange, 20, currentPage);
        setTracks(data);
      } catch (error) {
        console.error("Track fetch error:", error);
        if (error.response?.status === 401) {
          sessionStorage.clear();
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [timeRange, currentPage, navigate, memoizedGetTopTracks]);

  const handleCreatePlaylist = async (playlistName) => {
    if (tracks.length === 0) {
      alert("No tracks available to create playlist");
      return;
    }
    if (!playlistName) {
      alert("Please enter a playlist name");
      return;
    }

    const accessToken = sessionStorage.getItem("spotify_access_token");
    if (!accessToken) {
      navigate("/");
      return;
    }

    try {
      const trackToUse =
        selectedTracks.length > 0
          ? tracks.filter((track) => selectedTracks.includes(track.id))
          : tracks;
      const trackUris = trackToUse.map((track) => track.uri);
      const playlistUrl = await createPlaylist(accessToken, trackUris, playlistName);
      window.open(playlistUrl, "_blank");
    } catch (error) {
      console.error("Playlist creation error:", error);
      if (error.response?.status === 401) {
        sessionStorage.clear();
        navigate("/");
      } else {
        alert("Failed to create playlist. Please try again.");
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedTracks.length === tracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(tracks.map((track) => track.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <motion.div
          className="text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Loading your top tracks...</h2>
          <p className="text-xl">Please wait</p>
          <div className="mt-8 w-16 h-16 border-t-4 border-white rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Top Tracks
        </motion.h1>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              setCurrentPage(0); // Reset to first page when changing time range
            }}
            className="px-4 py-2 bg-black bg-opacity-20 text-white rounded-lg outline-none focus:ring-2 focus:ring-white"
          >
            <option value="short_term">Last 4 weeks</option>
            <option value="medium_term">Last 6 months</option>
            <option value="long_term">All time</option>
          </select>
        </motion.div>

        <motion.button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-green-500 text-white text-lg font-semibold rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-purple-500 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {selectedTracks.length === tracks.length ? "Deselect All" : "Select All"}
        </motion.button>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence>
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TrackCard
                  track={track}
                  isSelected={selectedTracks.includes(track.id)}
                  onToggle={handleToggleTrack}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={tracks.length < 20} // disable if less than 20 tracks (i.e. last page)
            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <input
            type="text"
            placeholder="Playlist Name"
            className="px-4 py-2 bg-black bg-opacity-20 text-white rounded-lg outline-none focus:ring-2 focus:ring-white mb-4"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <button
            onClick={() => handleCreatePlaylist(playlistName)}
            className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={tracks.length === 0}
          >
            Create Playlist
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;