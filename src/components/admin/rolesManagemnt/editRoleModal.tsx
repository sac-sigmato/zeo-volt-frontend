"use client";

import { useEffect, useState } from "react";
import { api_url } from "../../../../utils/apiCall";
import { toast } from "sonner";
import { Permission, Role } from "../../../../types/models";

interface Props {
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditRoleModal({ role, onClose, onSuccess }: Props) {
  const [name] = useState<string>(role.name);
  const [description] = useState<string>(role.description || "");
  const [status] = useState<string>(role.status);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role.permissions.map((perm) => perm._id)
  );

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${api_url}admin/getAllPermissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Permission[] = await res.json();
        if (res.ok) setAllPermissions(data);
        else toast.error("Failed to load permissions");
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Error loading permissions");
      }
    };

    fetchPermissions();
  }, []);

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Role name is required");
      return;
    }

    const payload = {
      name,
      description,
      status,
      permissions: selectedPermissions,
    };

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}admin/updateRole/${role._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: { message: string } = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Role updated successfully");
      onSuccess();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to update role");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold text-[#3b414e] mb-4">Edit Role</h2>

        <div className="space-y-4">
          <ReadOnlyInput label="*Role Name" value={name} />

          <div>
            <label className="font-medium text-sm">Permissions</label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-auto">
              {allPermissions.map((perm) => (
                <label
                  key={perm._id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm._id)}
                    onChange={() => togglePermission(perm._id)}
                  />
                  {perm.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-100 cursor-not-allowed text-gray-500"
      />
    </div>
  );
}
