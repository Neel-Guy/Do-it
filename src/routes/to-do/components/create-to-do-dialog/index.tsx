import { Button } from "@/ui/button";
import { Checkbox } from "@/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import type { Todo } from "@/utils/types";
import { Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface CreateTodoDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreateTodo: (
		todo: Omit<Todo, "id" | "createdAt" | "isCompleted" | "completedCount">,
	) => void;
	categories: Array<{ name: string; color: string }>;
}

const notificationFrequencies = [
	"Daily",
	"3 days",
	"1 week",
	"2 weeks",
	"1 month",
	"3 months",
];

export function CreateTodoDialog({
	open,
	onOpenChange,
	onCreateTodo,
	categories,
}: CreateTodoDialogProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [customCategory, setCustomCategory] = useState("");
	const [showCustomCategory, setShowCustomCategory] = useState(false);
	const [notificationFrequency, setNotificationFrequency] = useState("1 week");
	const [isRecurring, setIsRecurring] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		const finalCategory =
			showCustomCategory && customCategory.trim()
				? customCategory.trim()
				: category || "Personal";

		onCreateTodo({
			title: title.trim(),
			description: description.trim(),
			category: finalCategory,
			notificationFrequency,
			isRecurring,
		});

		// Reset form
		setTitle("");
		setDescription("");
		setCategory("");
		setCustomCategory("");
		setShowCustomCategory(false);
		setNotificationFrequency("1 week");
		setIsRecurring(false);
		onOpenChange(false);
	};

	const handleCategoryChange = (value: string) => {
		if (value === "custom") {
			setShowCustomCategory(true);
			setCategory("");
		} else {
			setShowCustomCategory(false);
			setCategory(value);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Create New Todo</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							placeholder="Enter todo title..."
							value={title}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setTitle(e.target.value)
							}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Enter todo description..."
							value={description}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
								setDescription(e.target.value)
							}
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select
							onValueChange={handleCategoryChange}
							value={showCustomCategory ? "custom" : category}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((cat) => (
									<SelectItem key={cat.name} value={cat.name}>
										{cat.name}
									</SelectItem>
								))}
								<SelectItem value="custom">
									<div className="flex items-center">
										<Plus className="h-4 w-4 mr-2" />
										Create New Category
									</div>
								</SelectItem>
							</SelectContent>
						</Select>

						{showCustomCategory && (
							<Input
								placeholder="Enter new category name..."
								value={customCategory}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setCustomCategory(e.target.value)
								}
								className="mt-2"
							/>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="notification">Notification Frequency</Label>
						<Select
							value={notificationFrequency}
							onValueChange={setNotificationFrequency}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{notificationFrequencies.map((freq) => (
									<SelectItem key={freq} value={freq}>
										{freq}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="recurring"
							checked={isRecurring}
							onCheckedChange={(checked: boolean) =>
								setIsRecurring(checked as boolean)
							}
						/>
						<Label
							htmlFor="recurring"
							className="text-sm font-normal cursor-pointer"
						>
							This is a recurring task
						</Label>
					</div>

					<DialogFooter className="flex-col sm:flex-row gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="w-full sm:w-auto"
						>
							Cancel
						</Button>
						<Button type="submit" className="w-full sm:w-auto">
							Create Todo
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
