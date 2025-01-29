
const Login = () => {
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