import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <h1 className="text-3xl font-bold tracking-tighter">SkillSync</h1>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
