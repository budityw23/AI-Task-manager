export interface ITask {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    dueDate: Date;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
    category?: string | null;
    createdAt: Date;
    updatedAt: Date;
}