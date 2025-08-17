"use client"
import AdminMainLayout from "@/components/layout/adminLayout";
import { useRouter } from "next/navigation";

export default function AdminManagementSetup() {
  const router = useRouter();

  return (
    <AdminMainLayout>
      <div className="p-6 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Admin Management</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/admin/permissions/list")}
            className="w-full border rounded-lg p-6 shadow-sm hover:shadow transition text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Permissions</h3>
            <p className="text-sm text-gray-500">
              Manage available permission types
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/roles/list")}
            className="w-full border rounded-lg p-6 shadow-sm hover:shadow transition text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Roles</h3>
            <p className="text-sm text-gray-500">
              Define roles and assign permissions
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/subAdmin/list")}
            className="w-full border rounded-lg p-6 shadow-sm hover:shadow transition text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Sub Admins</h3>
            <p className="text-sm text-gray-500">
              Create and manage sub-admin users
            </p>
          </button>
        </div>
      </div>
    </AdminMainLayout>
  );
}
