"use client";

import { api_url } from "../../../../utils/apiCall";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EditRoleModal from "./editRoleModal";
import { Pencil } from "lucide-react";
import Loader from "../../../../loader/loader";
import { Role } from "../../../../types/models";

export default function RoleList({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRole, setEditRole] = useState<Role | null>(null); // ✅ State for modal

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${api_url}admin/getAllRoles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch roles");

        setRoles(data);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [refreshKey]);

  return (
    <div className="overflow-x-auto min-h-[200px]">
      {loading ? (
        <div>
          {" "}
          <Loader />
        </div>
      ) : (
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead className="bg-[#f4f6f8]">
            <tr>
              <th className="text-left font-normal p-3">Role</th>
              <th className="text-left font-normal p-3">Description</th>

              <th className="text-left font-normal p-3">Permissions</th>

              <th className="text-left font-normal p-3">Edit</th>
            </tr>
          </thead>
          <tbody className="font-semibold">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No Roles Found
                </td>
              </tr>
            ) : (
              roles.map((role, index) => (
                <tr key={index} className="bg-white rounded-[8px] shadow-sm">
                  <td className="p-3">{role.name}</td>
                  <td className="p-3">{role.description || "N/A"}</td>
                  <td className="p-3">
                    {role.permissions?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {role.permissions.map((perm) => (
                          <li key={perm._id}>{perm.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No permissions</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setEditRole(role)}
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {editRole && (
        <EditRoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSuccess={() => {
            onRefresh();
            setEditRole(null);
          }}
        />
      )}
    </div>
  );
}
