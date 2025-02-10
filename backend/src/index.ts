import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from './database/prisma';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/test/users', async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: "test@example.com",
                username: "testuser",
                password: "password123", // In real app, this should be hashed
            }
        });
        res.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

app.get('/api/test/users', async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});