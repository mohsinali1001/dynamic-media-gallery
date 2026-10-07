import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db.js';
import mediaRoutes from './routes/media.js';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes
// ============================================

app.use('/api/media', mediaRoutes);



// ============================================
// Basic Test Route
// ============================================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Media Gallery API is running.'
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
