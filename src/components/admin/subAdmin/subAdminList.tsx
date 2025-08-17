"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchCheckIcon } from "lucide-react";
import { api_url } from "../../../../utils/apiCall";
import ManageUsersList from "./userList";
import Loader from "../../../../loader/loader";

export default function SubAdminUsersPage({
  refreshKey,
}: {
  refreshKey?: number;
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}admin/all/subadmins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to fetch users");
        return;
      }

      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Server error while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, [search, status, refreshKey]); // 👈 include refreshKey here

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-[220px] text-[#606873]">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-[8px] py-[10px] pl-[40px] pr-[14px] text-[14px] font-normal w-full placeholder-[#606873]"
              />
              <SearchCheckIcon className="w-5 h-5 absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            </div>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 py-[10px] px-[14px] rounded-[8px] text-[14px] text-[#606873]"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
<div>
                <Loader />
  
</div>        ) : (
          <ManageUsersList users={users} refreshUsers={fetchSubAdmins} />
        )}
      </div>
    </div>
  );
}
