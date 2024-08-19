import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { appRouter } from "./AppRouter";
import { useCurrentUser } from "./hooks/useCurrentUser";

const queryClient = new QueryClient();

function App() {
  const { currentUser, loading } = useCurrentUser();
  const { username } = currentUser || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}

export default App;
