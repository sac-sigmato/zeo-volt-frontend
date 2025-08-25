"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";
import { api_url } from "../../../../utils/apiCall";

type Task = {
  _id?: string;
  title?: string;
  description?: string;
};

type TechPerson = {
  _id: string;
  name: string;
  email: string;
  phone: string;
};

export default function TechPersons() {
  const [techPersons, setTechPersons] = useState<TechPerson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<
    (TechPerson & { tasks?: Task[] }) | null
  >(null);

  // Fetch tech persons list
  useEffect(() => {
    fetchTechPersons();
  }, []);

  const fetchTechPersons = async () => {
    fetch(`${api_url}tech-persons`)
      .then((res) => res.json())
      .then((data) => {
        setTechPersons(Array.isArray(data.techPersons) ? data.techPersons : []);
      })
      .catch((err) => {
        console.error("Error fetching tech persons:", err);
        setTechPersons([]);
      });
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${api_url}add-tech-person`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await fetchTechPersons();
      setShowModal(false);
      setForm({ name: "", email: "", phone: "" });
    }
  };

  return (
    <AdminMainLayout>
      <div className="flex flex-col gap-6 w-full mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Tech Persons List
          </h1>
          <button
            className="flex items-center gap-2 bg-black hover:bg-gray-700 transition text-white px-5 py-2 rounded-lg shadow"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Add Tech Person
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tasks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {techPersons.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 italic"
                  >
                    No tech persons added yet.
                  </td>
                </tr>
              ) : (
                techPersons.map((person) => (
                  <tr key={person._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {person.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {person.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {person.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        className="text-black-600 hover:underline font-medium"
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `${api_url}tech-person/${person._id}/tasks`
                            );
                            if (res.ok) {
                              const data = await res.json();
                              setSelectedPerson({
                                ...person,
                                tasks: data.techPerson?.tasks || [],
                              });
                            } else {
                              setSelectedPerson({ ...person, tasks: [] });
                            }
                          } catch (err) {
                            console.error("Error fetching tasks:", err);
                            setSelectedPerson({ ...person, tasks: [] });
                          }
                          setShowTasksModal(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tasks Modal */}
        {showTasksModal && selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl min-w-[320px] max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Tasks for {selectedPerson.name}
              </h2>
              {Array.isArray(selectedPerson.tasks) &&
              selectedPerson.tasks.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {selectedPerson.tasks.map((task, idx) => (
                    <li key={task._id || idx}>
                      {task.title ? (
                        <>
                          <span className="font-semibold">{task.title}</span>
                          {task.description && (
                            <span className="text-gray-500">
                              {" "}
                              - {task.description}
                            </span>
                          )}
                        </>
                      ) : (
                        JSON.stringify(task)
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500">No tasks assigned.</div>
              )}
              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setShowTasksModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Tech Person Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl min-w-[320px] max-w-sm w-full">
              <h2 className="text-lg font-bold mb-4 text-gray-800">
                Add Tech Person
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black hover:bg-black-700 transition text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminMainLayout>
  );
}
