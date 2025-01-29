import axios from 'axios';
import { useCallback } from 'react';

const useSpotify = () => {
    const checkTokenExpiry = () => {
        const expiryTime = sessionStorage.getItem('spotify_token_expiry');
        const accessToken = sessionStorage.getItem('spotify_access_token');
        
        if (!expiryTime || !accessToken) {
            console.log('No token or expiry found');
            return true;
        }
        
        const isExpired = Date.now() > (parseInt(expiryTime) - 60000);
        console.log('Token expired:', isExpired);
        return isExpired;
    };

    const getAccessToken = async () => {
        try {
            if (!checkTokenExpiry()) {
                const token = sessionStorage.getItem('spotify_access_token');
                console.log('Using existing token:', token?.substring(0, 10) + '...');
                return token;
            }

            const refreshToken = sessionStorage.getItem('spotify_refresh_token');
            if (!refreshToken) {
                console.error('No refresh token found');
                throw new Error('No refresh token available');
            }

            console.log('Attempting token refresh');
            const response = await axios.post('http://localhost:8080/auth/refresh', {
                refresh_token: refreshToken
            });

            const { access_token, expires_in } = response.data;
            const expiryTime = Date.now() + (expires_in * 1000);
            
            console.log('New token received:', access_token.substring(0, 10) + '...');
            console.log('Token expires at:', new Date(expiryTime).toISOString());
            
            sessionStorage.setItem('spotify_access_token', access_token);
            sessionStorage.setItem('spotify_token_expiry', expiryTime.toString());
            
            return access_token;
        } catch (error) {
            console.error('Token retrieval error:', error);
            sessionStorage.clear();
            window.location.href = '/';
            throw new Error('Failed to get access token');
        }
    };

    const getTopTracks = useCallback(async (timeRange, limit=20) => {
        let retries = 3;
        let delay = 1000;
        
        while (retries > 0) {
            try {
                console.log(`Attempting to fetch tracks (${retries} retries left)`);
                const accessToken = await getAccessToken();
                
                if (!accessToken) {
                    throw new Error('No access token available');
                }

                const response = await axios.get('http://localhost:8080/api/tracks', {
                    params: { timeRange, limit },
                    headers: { 
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });

                return response.data;
            } catch (error) {
                console.error(`Attempt failed (${retries} retries left):`, error.message);
                
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        sessionStorage.clear();
                        window.location.href = '/';
                        break;
                    }
                    
                    if (error.code === 'ECONNABORTED' || error.response?.status === 503) {
                        retries--;
                        if (retries > 0) {
                            await new Promise(resolve => setTimeout(resolve, delay));
                            delay *= 2; // Exponential backoff
                            continue;
                        }
                    }
                }
                
                throw new Error('Failed to fetch top tracks');
            }
        }
    }, []);

    return { getTopTracks };
};

export default useSpotify;