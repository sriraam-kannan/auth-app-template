import { Navigate, Outlet } from "react-router-dom";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";

export default function AuthorizedLayout() {
  const user: any = localStorage.getItem("neoUser");
  const parsedUser = JSON.parse(user);

  if (!parsedUser) {
    console.log("user not logged in", parsedUser);
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
}
