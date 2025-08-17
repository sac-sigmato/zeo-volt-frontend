"use client";

import { api_url } from "../../../../utils/apiCall";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "../../../../loader/loader";

type Permission = {
  name: string;
  description: string;
  status: string;
  slug: string;
};

export default function PermissionList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");

        const res = await fetch(`${api_url}admin/getAllPermissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch permissions");
        }

        setPermissions(data);
      } catch (err) {
        const error = err as Error
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <div className="">
      {loading ? (
<div>
                <Loader />
  
</div>      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-3">
            <thead className="bg-[#f4f6f8]">
              <tr>
                <th className="text-left font-medium rounded-tl-[12px] rounded-bl-[12px] p-3">
                  Permission Name
                </th>
                <th className="text-left font-medium p-3">Description</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No Permissions Found
                  </td>
                </tr>
              ) : (
                permissions.map((perm, index) => (
                  <tr
                    key={index}
                    className="bg-white rounded-[12px] shadow-sm border border-gray-100"
                  >
                    <td className="p-3 rounded-l-[12px]">{perm.name}</td>
                    <td className="p-3">
                      {perm.description?.trim() ? perm.description : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
