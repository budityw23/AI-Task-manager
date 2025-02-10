import { Router, Request, Response } from 'express';
import prisma from '../database/prisma';
import { PrismaClient } from '@prisma/client';
import { createUserWithTasks } from '../database/transaction';
import dotenv from 'dotenv';

const router = Router();

router.post('/users', async (req: Request, res: Response) => {
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

router.get('/users', async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/connection-pool', async (_req: Request, res: Response) => {
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

router.get('/test-db', async (_req: Request, res: Response) => {
    try {
        const testPrisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        });
        
        await testPrisma.$connect();
        
        // Generate a unique email using timestamp
        const timestamp = Date.now();
        await testPrisma.user.create({
            data: {
                email: `test${timestamp}@test.com`,
                username: `testuser${timestamp}`,
                password: "test123123"
            }
        });
        
        const users = await testPrisma.user.findMany();
        
        await testPrisma.$disconnect();
        
        res.json({ 
            message: "Database connection successful", 
            environment: process.env.NODE_ENV,
            connectionUrl: process.env.DATABASE_URL?.split('@')[1], // Only show host part for security
            users 
        });
    } catch (error) {
        console.error('Database connection test error:', error);
        res.status(500).json({ 
            error: 'Failed to connect to database',
            environment: process.env.NODE_ENV,
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/transaction', async (_req: Request, res: Response) => {
    try {
        const result = await createUserWithTasks(
            {
                email: "transaction123@test.com",
                username: "transactiontest123",
                password: "test123123"
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

export default router; 