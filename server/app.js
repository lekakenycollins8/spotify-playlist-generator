const express = require('express');
const dotenv = require('dotenv');
const cors = require('./middleware/cors');
const authRouter = require('./routes/auth.routes');

dotenv.config();
const app = express();

//Middleware
app.use(cors);
app.use(express.json());

//Routes
app.use('/auth', authRouter);

//start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});