"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyTransfers = [
  {
    id: "TRF001",
    studentName: "Aarav Mehta",
    from: "HSR Center",
    to: "Indiranagar Center",
    date: "2024-12-15",
    reason: "Shifted residence",
  },
  {
    id: "TRF002",
    studentName: "Ishita Rao",
    from: "Electronic City",
    to: "Harlur Center",
    date: "2025-01-10",
    reason: "Closer to school",
  },
];

export default function CenterTransfersPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyTransfers.filter((t) =>
    t.studentName.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Student Center Transfers</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> New Transfer
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subscriber, center or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{t.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.studentName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.from}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.to}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{t.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-400 text-sm">
                  No transfer records found.
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