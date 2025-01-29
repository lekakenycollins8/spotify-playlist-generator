import { useLocation } from 'react-router-dom';

const Error = () => {
    const location = useLocation();
    const error = new URLSearchParams(location.search).get('error');

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">An error occurred</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <p className="text-gray-600">Please try again later</p>
            </div>
        </div>
    );
};

export default Error;