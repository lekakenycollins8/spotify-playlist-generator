const express = require('express');
const dotenv = require('dotenv');
const cors = require('./middleware/cors');
const authRouter = require('./routes/auth.routes');
const trackRouter = require('./routes/tracks.routes');
const playlistRouter = require('./routes/playlist.routes');

dotenv.config();
const app = express();

// Define allowed origins
const allowedOrigins = ["https://spotify-playlist-generator-client-nine.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

// Apply CORS Middleware
app.use(cors(corsOptions));
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
