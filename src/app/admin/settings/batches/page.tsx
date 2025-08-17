"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyTimings = [
  { id: "BTP001", name: "Batch A", days: "Mon, Wed", time: "4:00 PM - 5:00 PM" },
  { id: "BTP002", name: "Batch B", days: "Tue, Thu", time: "5:00 PM - 6:00 PM" },
  { id: "BTP003", name: "Batch C", days: "Sat", time: "11:00 AM - 12:00 PM" },
];

export default function BatchTimingsPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyTimings.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.days.toLowerCase().includes(search.toLowerCase()) ||
    b.time.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Batch Timings</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Timing
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, day, time or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{b.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{b.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{b.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">{b.time}</td>
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
                  No timings found.
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