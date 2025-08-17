"use client";

import { api_url } from "../../../../utils/apiCall";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordModal({
  onClose,
  userId,
  userType,
}: {
  onClose: () => void;
  userId: string;
  userType: string;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const endpoint =
        userType === "superadmin"
          ? `${api_url}superAdmin/change-password/${userId}`
          : `${api_url}admin/subadmin/change-password/${userId}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to change password");

      toast.success("Password changed successfully");
      onClose();
    } catch (err) {
      const error = err as Error
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[95%] max-w-md p-6 relative shadow-lg space-y-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-[22px] font-bold text-[#606873]">
          Change Password
        </h2>
        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm pr-10"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm pr-10"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="inline-flex items-center w-full justify-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
