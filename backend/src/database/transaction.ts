import { PrismaClient, Prisma } from '@prisma/client';
import prisma from './prisma';

export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    try {
      return await fn(tx);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, {
    maxWait: 5000, // maximum time to wait for transaction to start
    timeout: 10000  // maximum time for entire transaction
  });
}

// Updated type definitions for the create functions
export async function createUserWithTasks(
  userData: Omit<Prisma.UserCreateInput, 'tasks'>,
  tasksData: Array<Omit<Prisma.TaskCreateInput, 'user'>>
) {
  return await withTransaction(async (tx) => {
    const user = await tx.user.create({
      data: userData
    });

    const tasks = await Promise.all(
      tasksData.map(taskData =>
        tx.task.create({
          data: {
            ...taskData,
            user: {
              connect: { id: user.id }
            }
          }
        })
      )
    );

    return { user, tasks };
  });
}