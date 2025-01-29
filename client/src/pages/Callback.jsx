import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const expiresIn = searchParams.get('expires_in');

        console.log('Callback received tokens:', {
            accessToken: accessToken?.substring(0, 10) + '...',
            refreshToken: refreshToken?.substring(0, 10) + '...',
            expiresIn
        });

        if (accessToken && refreshToken && expiresIn) {
            const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
            
            sessionStorage.setItem('spotify_access_token', accessToken);
            sessionStorage.setItem('spotify_refresh_token', refreshToken);
            sessionStorage.setItem('spotify_token_expiry', expiryTime.toString());
            
            console.log('Tokens stored in session storage');
            navigate('/dashboard');
        } else {
            console.error('Missing required tokens');
            navigate('/');
        }
    }, [searchParams, navigate]);

    return <div>Loading...</div>;
};

export default Callback;