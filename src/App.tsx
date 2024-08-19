import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth"; // Import the AuthProvider
import { appRouter } from "./AppRouter";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider> 
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={appRouter} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
