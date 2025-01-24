import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const accessToken = searchParams.get('access_token');

    useEffect(() => {
        if (accessToken) {
            window.sessionStorage.setItem('spotify_access_token', accessToken);
        } else {
            window.location.href = '/';
        }
    }, [accessToken]);

    return <div>Dashboard</div>;
};

export default Dashboard;