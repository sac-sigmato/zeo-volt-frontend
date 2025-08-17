"use client"
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";

const dummyCriteria = [
  { id: "AST001", parameter: "Participation", weightage: "25%" },
  { id: "AST002", parameter: "Skill Progression", weightage: "30%" },
  { id: "AST003", parameter: "Attendance", weightage: "20%" },
  { id: "AST004", parameter: "Discipline", weightage: "15%" },
  { id: "AST005", parameter: "Creativity", weightage: "10%" },
];

export default function AssessmentCriteriaPage() {
  const [search, setSearch] = useState("");

  const filtered = dummyCriteria.filter((c) =>
    c.parameter.toLowerCase().includes(search.toLowerCase()) ||
    c.weightage.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
        <AdminMainLayout>
    
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Assessment Criteria</h1>
        <button className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add New Parameter
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by parameter, weightage or ID"
          className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
        />
      </div>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parameter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weightage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{c.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{c.parameter}</td>
                <td className="px-6 py-4 whitespace-nowrap">{c.weightage}</td>
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
                  No assessment criteria found.
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
