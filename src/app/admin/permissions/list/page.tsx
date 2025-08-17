
"use client"
import PermissionList from "@/components/admin/rolesManagemnt/permissionList";
import AdminMainLayout from "@/components/layout/adminLayout";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PermissionManagementPage() {

  const router = useRouter();
  return (
    <AdminMainLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold"> Permissions List</h1>

          <button
            onClick={() => router.push("/admin/permissions/add")}
            className="inline-flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Permissions
          </button>
        </div>

        <PermissionList />
      </div>
    </AdminMainLayout>
  );
}
