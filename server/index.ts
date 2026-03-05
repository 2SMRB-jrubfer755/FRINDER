import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
import tournamentRoutes from './routes/tournaments';
import chatRoutes from './routes/chats';
import sessionRoutes from './routes/sessions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/frinder';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
    res.send('Frinder API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
