export interface INotification {
    id: string;
    userId: string;
    taskId: string;
    type: string;
    message: string;
    isRead: boolean;
    scheduledFor: Date;
    createdAt: Date;
    updatedAt: Date;
}
