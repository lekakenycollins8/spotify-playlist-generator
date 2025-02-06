const cors = require('cors');

// Whitelist allowed origins
const whitelist = [
  "https://spotify-playlist-generator-client-nine.vercel.app", // Client URL
  "https://spotify-playlist-generator-server.vercel.app" // Server URL
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

module.exports = cors(corsOptions);
