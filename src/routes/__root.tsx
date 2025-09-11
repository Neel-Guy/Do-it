import { TanstackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { BottomNav } from "@/components/bottom-nav";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/context/ThemeProvider";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Navbar />
      <Outlet />
      <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      <BottomNav />
    </ThemeProvider>
  ),
});
