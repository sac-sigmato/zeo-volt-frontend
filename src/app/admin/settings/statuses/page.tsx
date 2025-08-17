"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyStatuses = [
  { id: "STS001", label: "Active", color: "green" },
  { id: "STS002", label: "Inactive", color: "gray" },
  { id: "STS003", label: "On Hold", color: "yellow" },
  { id: "STS004", label: "Plan Paused", color: "orange" },
  { id: "STS005", label: "Expired", color: "red" },
];

export default function SubscriptionStatusesPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyStatuses.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase()) ||
    s.color.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Subscription Statuses</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Status
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by label, color or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indicator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{s.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{s.label}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-${s.color}-600 font-semibold`}>{s.label}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400 text-sm">
                  No statuses found.
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