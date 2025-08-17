"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummySkills = [
  { id: "SKL001", name: "Keyboard", category: "Music" },
  { id: "SKL002", name: "Drawing", category: "Art" },
  { id: "SKL003", name: "Zumba", category: "Dance" },
  { id: "SKL004", name: "Chess", category: "Cognitive" },
];

export default function SkillsPage() {
  const [search, setSearch] = useState("");

  const filtered = dummySkills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Skills & Categories</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Skill
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by skill name, category or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((skill) => (
              <tr key={skill.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{skill.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{skill.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{skill.category}</td>
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
                  No skills found.
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