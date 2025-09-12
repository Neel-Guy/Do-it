import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Input } from "@/ui/input";
import { CheckSquare, Filter, Plus, Search } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { CreateTodoDialog } from "./components/create-to-do-dialog";
import { TodoItem } from "./components/to-do-item";

import { addData } from "@/utils/indexed-db/to-do";
import type { Todo } from "@/utils/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/to-do/")({
	component: RouterComponent,
});

const categories = [
	{
		name: "Work",
		color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
	},
	{
		name: "Personal",
		color:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	},
	{
		name: "Health",
		color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
	},
	{
		name: "Learning",
		color:
			"bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
	},
	{
		name: "Finance",
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	},
];

function RouterComponent() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [sortBy, setSortBy] = useState<"date" | "category" | "title">("date");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	// Load sample data on component mount
	useEffect(() => {
		const sampleTodos: Todo[] = [
			{
				id: "1",
				title: "Complete project proposal",
				description:
					"Finish the Q4 project proposal and send to team for review",
				category: "Work",
				notificationFrequency: "1 week",
				isRecurring: false,
				isCompleted: false,
				completedCount: 0,
				createdAt: new Date("2024-01-15"),
			},
			{
				id: "2",
				title: "Morning workout",
				description: "Do 30 minutes of cardio and strength training",
				category: "Health",
				notificationFrequency: "Daily",
				isRecurring: true,
				isCompleted: false,
				completedCount: 12,
				createdAt: new Date("2024-01-10"),
			},
			{
				id: "3",
				title: "Read React documentation",
				description: "Study the new React 18 features and concurrent rendering",
				category: "Learning",
				notificationFrequency: "3 days",
				isRecurring: false,
				isCompleted: true,
				completedCount: 1,
				createdAt: new Date("2024-01-12"),
			},
		];
		setTodos(sampleTodos);
	}, []);

	const filteredAndSortedTodos = todos
		.filter((todo) => {
			const matchesSearch =
				todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				todo.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "" || todo.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "title":
					return a.title.localeCompare(b.title);
				case "category":
					return a.category.localeCompare(b.category);
				case "date":
					return b.createdAt.getTime() - a.createdAt.getTime();
				default:
					return b.createdAt.getTime() - a.createdAt.getTime();
			}
		});

	const activeTodos = filteredAndSortedTodos.filter(
		(todo) => !todo.isCompleted || todo.isRecurring,
	);

	const handleCreateTodo = (
		todoData: Omit<Todo, "id" | "createdAt" | "isCompleted" | "completedCount">,
	) => {
		const newTodo: Todo = {
			...todoData,
			id: Date.now().toString(),
			createdAt: new Date(),
			isCompleted: false,
			completedCount: 0,
		};
		setTodos((prev) => [newTodo, ...prev]);
		addData(newTodo);
	};

	const handleToggleComplete = (id: string) => {
		setTodos((prev) =>
			prev.map((todo) => {
				if (todo.id === id) {
					if (todo.isRecurring) {
						return {
							...todo,
							completedCount: todo.completedCount + 1,
						};
					}
					return {
						...todo,
						isCompleted: !todo.isCompleted,
					};
				}
				return todo;
			}),
		);
	};

	const handleEditTodo = (id: string, updatedTodo: Partial<Todo>) => {
		setTodos((prev) =>
			prev.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)),
		);
	};

	const handleDeleteTodo = (id: string) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	};

	return (
		<div className="flex flex-col h-full">
			{/* Search and Filter Section */}
			<div className="p-4 space-y-4">
				{/* Search Bar */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="Search todos..."
						value={searchTerm}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchTerm(e.target.value)
						}
						className="pl-9"
					/>
				</div>

				{/* Category Filter and Sort */}
				<div className="flex items-center justify-between">
					<div className="flex gap-2 overflow-x-auto pb-2">
						<Badge
							variant={selectedCategory === "" ? "default" : "secondary"}
							className="cursor-pointer whitespace-nowrap"
							onClick={() => setSelectedCategory("")}
						>
							All
						</Badge>
						{categories.map((category) => (
							<Badge
								key={category.name}
								variant={
									selectedCategory === category.name ? "default" : "secondary"
								}
								className={`cursor-pointer whitespace-nowrap ${
									selectedCategory === category.name ? "" : category.color
								}`}
								onClick={() =>
									setSelectedCategory(
										selectedCategory === category.name ? "" : category.name,
									)
								}
							>
								{category.name}
							</Badge>
						))}
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<Filter className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setSortBy("date")}>
								Sort by Date
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSortBy("title")}>
								Sort by Title
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setSortBy("category")}>
								Sort by Category
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Todo List */}
			<div className="flex-1 px-4 pb-20 overflow-y-auto">
				<div className="space-y-3">
					{activeTodos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggleComplete={handleToggleComplete}
							onEdit={handleEditTodo}
							onDelete={handleDeleteTodo}
							categories={categories}
						/>
					))}
					{activeTodos.length === 0 && (
						<div className="text-center py-12 text-muted-foreground">
							<CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
							<p>No todos found</p>
							<p className="text-sm">Create your first todo to get started!</p>
						</div>
					)}
				</div>
			</div>

			{/* Floating Add Button */}
			<Button
				onClick={() => setIsCreateDialogOpen(true)}
				className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg"
				size="icon"
			>
				<Plus className="h-6 w-6" />
			</Button>

			{/* Create Todo Dialog */}
			<CreateTodoDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				onCreateTodo={handleCreateTodo}
				categories={categories}
			/>
		</div>
	);
}
