import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    //check for access token in url after spotify redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');

        if (accessToken) {
            console.log('Token received:', accessToken);
            window.sessionStorage.setItem('spotify_access_token', accessToken);
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
            <a
                href="http://localhost:8080/auth/login"
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                >
                Login with Spotify
            </a>
        </div>
    );
};

export default Login;