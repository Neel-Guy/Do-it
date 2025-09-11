import { Button } from "@/ui/button";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { CheckSquare, FileText, User } from "lucide-react";

const navigationItems = [
  { id: "todos", label: "Todos", icon: CheckSquare, navigateTo: "/to-do" },
  { id: "notes", label: "Notes", icon: FileText, navigateTo: "/notes" },
  { id: "account", label: "Account", icon: User, navigateTo: "/account" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-50">
      <div className="grid grid-cols-3 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.navigateTo;

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full rounded-none space-y-1 ${
                isActive
                  ? "text-primary bg-accent/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate({ to: item.navigateTo })}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
