import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import {connectDatabase} from './config/database';

config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

// Database connection
mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    logger.info('Database connected successfully');
})
.catch((error) => {
    logger.error('Database connection failed:', error);
});

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
