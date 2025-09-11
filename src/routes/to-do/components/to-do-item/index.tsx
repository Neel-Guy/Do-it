import { useState } from "react";
import { MoreVertical, Edit, Trash, Check } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Checkbox } from "@/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { EditTodoDialog } from "../edit-to-do-dialog";
import type { Todo } from "../..";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  categories: Array<{ name: string; color: string }>;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
  categories,
}: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return (
      category?.color ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <Card
        className={`transition-all duration-200 ${
          todo.isCompleted && !todo.isRecurring
            ? "opacity-60 bg-muted/50"
            : "hover:shadow-md"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Checkbox */}
            <div className="flex items-center pt-1">
              {todo.isRecurring ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 rounded-sm border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onToggleComplete(todo.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              ) : (
                <Checkbox
                  checked={todo.isCompleted}
                  onCheckedChange={() => onToggleComplete(todo.id)}
                  className="h-5 w-5"
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium ${
                      todo.isCompleted && !todo.isRecurring
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {truncateText(todo.title, 50)}
                  </h3>
                  <p
                    className={`text-sm text-muted-foreground mt-1 ${
                      todo.isCompleted && !todo.isRecurring
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {truncateText(todo.description, 100)}
                  </p>
                </div>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(todo.id)}
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className={getCategoryColor(todo.category)}
                  >
                    {todo.category}
                  </Badge>
                  {todo.isRecurring && todo.completedCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      ×{todo.completedCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {todo.notificationFrequency}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTodoDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        todo={todo}
        onEditTodo={(updatedTodo: Partial<Todo>) =>
          onEdit(todo.id, updatedTodo)
        }
        categories={categories}
      />
    </>
  );
}
