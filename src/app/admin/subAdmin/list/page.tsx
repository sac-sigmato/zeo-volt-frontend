"use client";

import SubAdminUsersPage from "@/components/admin/subAdmin/subAdminList";
import AdminMainLayout from "@/components/layout/adminLayout";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubAdminPage() {
  const [refreshKey] = useState(0);
  const router = useRouter();
  // const handleRefresh = () => {
  //   setRefreshKey((prev) => prev + 1);
  // };

  return (
    <AdminMainLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold"> Sub admins List</h1>

          <button
            onClick={() => router.push("/admin/subAdmin/add")}
            className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Sub admins
          </button>
        </div>

        <SubAdminUsersPage refreshKey={refreshKey} />
      </div>
    </AdminMainLayout>
  );
}
