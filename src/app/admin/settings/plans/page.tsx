"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyPlans = [
  { id: "PLN001", name: "1 Month Plan", duration: "1 Month", sessions: 4 },
  { id: "PLN002", name: "3 Month Plan", duration: "3 Months", sessions: 12 },
  { id: "PLN003", name: "6 Month Plan", duration: "6 Months", sessions: 24 },
  { id: "PLN004", name: "12 Month Plan", duration: "12 Months", sessions: 48 },
];

export default function PlansPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyPlans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase()) ||
    plan.duration.toLowerCase().includes(search.toLowerCase()) ||
    plan.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Package Plans</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Plan
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by plan name, duration or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{plan.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plan.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plan.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">{plan.sessions}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400 text-sm">
                  No plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
        </AdminMainLayout>
    
  );
}
