const express = require('express');
const dotenv = require('dotenv');
const cors = require('./middleware/cors');
const authRouter = require('./routes/auth.routes');
const trackRouter = require('./routes/tracks.routes');
const playlistRouter = require('./routes/playlist.routes');

dotenv.config();
const app = express();

// Allow requests from frontend URL
const allowedOrigins = ["https://spotify-playlist-generator-client-nine.vercel.app"];

//Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies & authentication headers
  })
);
app.use(express.json());

//Routes
app.use('/auth', authRouter);
app.use('/api/tracks', trackRouter);
app.use('/api/playlist', playlistRouter);

//start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
