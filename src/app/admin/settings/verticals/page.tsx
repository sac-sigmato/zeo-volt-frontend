"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyVerticals = [
  { id: "VERT001", name: "Regular Skill Learning", code: "RSL" },
  { id: "VERT002", name: "Camps", code: "CMP" },
  { id: "VERT003", name: "Workshops", code: "WKS" },
  { id: "VERT004", name: "Professional Courses", code: "PRF" },
];

export default function VerticalsPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyVerticals.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminMainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Business Verticals</h1>
          <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            <Plus className="w-4 h-4" /> Add New Vertical
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code or ID"
            className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
          />
        </div>

        <div className="overflow-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vertical Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{v.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{v.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-400 text-sm"
                  >
                    No verticals found.
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
