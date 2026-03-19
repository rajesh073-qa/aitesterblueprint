import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Basic health check route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Test Generator AntiGravity Backend is running' });
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
