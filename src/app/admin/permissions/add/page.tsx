"use client"
import AddPermissionForm from "@/components/admin/rolesManagemnt/addPermissionForm";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function PermissionManagementPage() {
  return (
    <AdminMainLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold"> Add Permission</h1>

        <AddPermissionForm />
      </div>
    </AdminMainLayout>
  );
}
