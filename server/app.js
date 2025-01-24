const express = require('express');
const dotenv = require('dotenv');
const cors = require('./middleware/cors');
const authRouter = require('./routes/auth.routes');
const trackRouter = require('./routes/tracks.routes');
const playlistRouter = require('./routes/playlist.routes');

dotenv.config();
const app = express();

//Middleware
app.use(cors);
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