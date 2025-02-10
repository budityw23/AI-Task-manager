import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from './database/prisma';
import { PrismaClient } from '@prisma/client';
import { createUserWithTasks } from './database/transaction';

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

app.get('/api/test/connection-pool', async (req: Request, res: Response) => {
    try {
        const promises = Array(10).fill(null).map(() => 
            prisma.user.findMany({ take: 1 })
        );
        
        const startTime = Date.now();
        await Promise.all(promises);
        const endTime = Date.now();
        
        res.json({ 
            message: "Connection pool test completed", 
            timeInMs: endTime - startTime,
            queriesExecuted: 10
        });
    } catch (error) {
        console.error('Connection pool test error:', error);
        res.status(500).json({ error: 'Failed to test connection pool' });
    }
});

app.get('/api/test/test-db', async (req: Request, res: Response) => {
    try {
        // Load test environment variables
        dotenv.config({ path: '.env.test' });
        
        const testPrisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
        
        // Try to connect and perform operations
        await testPrisma.$connect();
        
        await testPrisma.user.create({
            data: {
                email: "test@test.com",
                username: "testuser",
                password: "test123"
            }
        });
        
        const users = await testPrisma.user.findMany();
        
        // Clean up connection
        await testPrisma.$disconnect();
        
        res.json({ 
            message: "Test database connection successful", 
            environment: process.env.NODE_ENV,
            users 
        });
    } catch (error) {
        console.error('Test database error:', error);
        res.status(500).json({ 
            error: 'Failed to connect to test database',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.post('/api/test/transaction', async (req: Request, res: Response) => {
    try {
        const result = await createUserWithTasks(
            {
                email: "transaction@test.com",
                username: "transactiontest",
                password: "test123"
            },
            [{
                title: "Test Task 1",
                dueDate: new Date(),
            },
            {
                title: "Test Task 2",
                dueDate: new Date(),
            }]
        );
        res.json(result);
    } catch (error) {
        console.error('Transaction test error:', error);
        res.status(500).json({ error: 'Transaction failed' });
    }
});     

app.listen(port, () => {
    console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
});