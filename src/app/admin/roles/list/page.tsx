"use client";
import RoleList from "@/components/admin/rolesManagemnt/roleList";
import AdminMainLayout from "@/components/layout/adminLayout";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RolesPage() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AdminMainLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold"> Roles and its Permission List</h1>

          <button
            onClick={() => router.push("/admin/roles/add")}
            className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Roles and its Permissions
          </button>
        </div>

        <RoleList refreshKey={refreshKey} onRefresh={handleRefresh} />
      </div>
    </AdminMainLayout>
  );
}
