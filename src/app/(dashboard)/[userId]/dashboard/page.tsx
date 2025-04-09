// app/dashboard/page.tsx

import { HiBell } from "react-icons/hi";

export default function DashboardPage() {
  return (
    <div className="h-full">
      {/* Top Navigation */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, Admin
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-slate-600 hover:text-slate-800">
            <HiBell className="h-6 w-6" />
          </button>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-slate-600"></div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Salonsphere Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Quick Stats</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* Add your metric cards here */}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Add charts/content sections here */}
        </div>
      </div>
    </div>
  );
}
