import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-16">
        <main className="container mx-auto px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
