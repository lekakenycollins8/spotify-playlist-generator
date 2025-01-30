import PropTypes from "prop-types"

const TrackCard = ({ track }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center p-4 space-x-4">
      <img
        src={track.album.images[0]?.url || "/placeholder.svg"}
        alt={track.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h3 className="text-white font-semibold text-lg truncate">{track.name}</h3>
        <p className="text-gray-400 text-sm truncate">{track.artists.map((artist) => artist.name).join(", ")}</p>
        <p className="text-gray-500 text-xs mt-1 truncate">{track.album.name}</p>
      </div>
    </div>
  )
}

TrackCard.propTypes = {
  track: PropTypes.shape({
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
      ),
    }).isRequired,
  }).isRequired,
}

export default TrackCard

