import PropTypes from "prop-types";
import { motion } from "framer-motion";

const TrackCard = ({ track, isSelected, onToggle }) => {
  return (
    <motion.div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center p-4 space-x-4 relative"
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute top-2 right-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(track.id)}
          className="w-6 h-6 cursor-pointer accent-green-500 rounded"
        />
      </div>
      <img
        src={track.album.images[0]?.url}
        alt={track.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h3 className="text-white font-semibold text-lg truncate">{track.name}</h3>
        <p className="text-gray-400 text-sm truncate">{track.artists.map((artist) => artist.name).join(", ")}</p>
        <p className="text-gray-500 text-xs mt-1 truncate">{track.album.name}</p>
      </div>
    </motion.div>
  );
};

TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    album: PropTypes.shape({
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        }),
      ).isRequired,
    }).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default TrackCard;
