export interface Todo {
	id: string;
	title: string;
	description: string;
	category: string;
	notificationFrequency: string;
	isRecurring: boolean;
	isCompleted: boolean;
	completedCount: number;
	createdAt: Date;
}
