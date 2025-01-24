import PropTypes from 'prop-types';

const TrackCard = ({ track }) => {
    return (
        <div className='bg-white rounded-lg shadow-lg p-4'>
            <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className='w-full h-48 object-cover rounded-lg'
            />
            <div className='mt-4'>
                <h2 className='text-lg font-semibold'>{track.name}</h2>
                <p className='text-sm text-gray-600'>
                    {track.artists.map((artist) => artist.name).join(', ')}
                </p>
            </div>
        </div>
    );
};

TrackCard.propTypes = {
    track: PropTypes.shape({
        album: PropTypes.shape({
            images: PropTypes.arrayOf(
                PropTypes.shape({
                    url: PropTypes.string,
                })
            ),
        }),
        name: PropTypes.string,
        artists: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
            })
        ),
    }).isRequired,
};

export default TrackCard;