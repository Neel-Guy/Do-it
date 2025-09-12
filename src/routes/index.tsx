import { getDB } from "@/utils/indexed-db/to-do";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: App,
	onEnter: () => {
		Navigate({ to: "/to-do" });
	},
});

export default function App() {
	useEffect(() => {
		// This ensures DB is opened and initialized once
		getDB()
			.then(() => {
				console.log("IndexedDB initialized.");
			})
			.catch(console.error);
	}, []);
	return <Navigate to="/to-do" />;
}
