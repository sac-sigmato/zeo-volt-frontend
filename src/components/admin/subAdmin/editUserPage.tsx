"use client";

import { api_url } from "../../../../utils/apiCall";
import React, { useState } from "react";
import { toast } from "sonner";

interface SubAdminUser {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role?: {
    name: string;
  };
}

interface Props {
  user: SubAdminUser;
  onClose: () => void;
  refreshUsers: () => void;
}

export default function SubAdminDetailsModal({
  user,
  onClose,
  refreshUsers,
}: Props) {
  const [status, setStatus] = useState<"Active" | "Inactive">(
    user.isActive ? "Active" : "Inactive"
  );
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}admin/update/subadmin/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user._id,
          isActive: status === "Active",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update status");
        return;
      }

      toast.success("Sub Admin status updated successfully");
      refreshUsers();
      onClose();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Server error while updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl space-y-5">
        <h2 className="text-xl font-bold text-[#3b414e] border-b pb-2">
          Edit Sub Admin Status
        </h2>

        <div className="space-y-3 text-sm text-[#3b414e]">
          <div>
            <label className="font-semibold block mb-1">Name:</label>
            <input
              value={user.name}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Email:</label>
            <input
              value={user.email}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Status:</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "Active" | "Inactive")
              }
              className={`w-full border rounded px-3 py-2 text-sm font-bold ${
                status === "Active" ? "text-green-600" : "text-red-500"
              }`}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Role:</label>
            <input
              value={user.role?.name || "N/A"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
