import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  onEnter: () => {
    Navigate({ to: "/to-do" });
  },
});

export default function App() {
  return <Navigate to="/to-do" />;
}
