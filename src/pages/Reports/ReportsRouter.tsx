import { Route, Routes } from "react-router-dom";
import Reports from "./Reports";

export default function ReportsRouter() {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
    </Routes>
  );
}
