"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import ChangePasswordModal from "./ChangePasswordModal";
import Loader from "../../../../loader/loader";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const storedData = sessionStorage.getItem("bloom_erp_user_store");
        const token = sessionStorage.getItem("token");

        if (!storedData || !token) return;

        const parsed = JSON.parse(storedData);
        const _id = parsed?.state?.user?._id;
        const type = parsed?.state?.user?.userRole?.toLowerCase(); // ✅ force lowercase

        if (!_id || !type) return;

        setUserId(_id);
        setUserType(type);

        const apiPath =
          type === "superadmin"
            ? `${api_url}superAdmin/get/by/${_id}`
            : `${api_url}admin/subadmin/get/by/${_id}`;

        const res = await fetch(apiPath, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch admin info");

        const data = await res.json();
        if (data?.name) setName(data.name);
        if (data?.email) setEmail(data.email);
      } catch (err) {
        const error = err as Error;

        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleUpdateProfile = async () => {
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!nameRegex.test(name)) {
      toast.error("Name should not contain special characters");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (!token || !userId || !userType) {
        toast.error("User not found in session");
        return;
      }

      const apiPath =
        userType === "superadmin"
          ? `${api_url}superAdmin/update/${userId}`
          : `${api_url}admin/subadmin/update/${userId}`;

      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-[22px] font-bold text-[#606873]">Details</h2>

        <div className="flex gap-4">
          {!loading && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
            >
              Edit
            </button>
          )}

          {!editMode && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="inline-flex items-center gap-2 bg-gray-500 text-white text-sm px-4 py-2 rounded hover:bg-gray-400"
            >
              Change Password
            </button>
          )}
        </div>

        {showChangePassword && (
          <ChangePasswordModal
            userId={userId}
            userType={userType}
            onClose={() => setShowChangePassword(false)}
          />
        )}
      </div>

      {loading ? (
        <div>
          {" "}
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[#3b414e] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!editMode}
                placeholder="Enter full name"
                className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-[14px] ${
                  !editMode ? "cursor-not-allowed bg-gray-100" : ""
                }`}
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-[#3b414e] mb-2">
                Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!editMode}
                placeholder="Enter email"
                className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-[14px] ${
                  !editMode ? "cursor-not-allowed bg-gray-100" : ""
                }`}
              />
            </div>
          </div>

          {editMode && (
            <div className="pt-4 flex gap-4">
              <button
                onClick={handleUpdateProfile}
                className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
              >
                Update Profile
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
