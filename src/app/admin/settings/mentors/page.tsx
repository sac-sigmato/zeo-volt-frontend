"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyMentors = [
  { id: "MNT001", name: "Riya Sharma", phone: "9876543210", skills: ["Dance", "Zumba"] },
  { id: "MNT002", name: "Aditya Joshi", phone: "9876501123", skills: ["Drawing"] },
  { id: "MNT003", name: "Sneha Rao", phone: "9876590000", skills: ["Keyboard", "Piano"] },
];

export default function MentorRegistryPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyMentors.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.skills.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Mentor Registry</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Mentor
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, ID or skills"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{m.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.skills.join(", ")}</td>
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
                  No mentors found.
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
