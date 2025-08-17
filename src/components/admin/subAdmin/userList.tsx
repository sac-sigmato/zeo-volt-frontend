"use client";

import { useState } from "react";
import SubAdminDetailsModal from "./editUserPage";
import { Pencil } from "lucide-react";

// Define a proper type for User
interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export default function ManageUsersList({
  users,
  refreshUsers,
}: {
  users: User[];
  refreshUsers: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px] text-[#3b414e] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#f4f6f8] text-[#3b414e]">
              <th className="text-left font-normal p-3 rounded-tl-[12px] rounded-bl-[12px]">
                Name
              </th>
              <th className="text-left font-normal p-3">Email</th>
              <th className="text-left font-normal p-3">Created On</th>
              <th className="text-left font-normal p-3">Status</th>
              <th className="text-left font-normal p-3 rounded-tr-[12px] rounded-br-[12px]">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white rounded-[12px] shadow-sm"
                >
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {new Date(user.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-[6px] text-[12px] font-bold ${
                        user.isActive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
                  No sub admin found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      {selectedUser && (
        <SubAdminDetailsModal
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            refreshUsers();
          }}
          refreshUsers={refreshUsers}
        />
      )}
    </>
  );
}
