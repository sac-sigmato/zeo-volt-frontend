"use client";

import AddRoleForm from "@/components/admin/rolesManagemnt/addRoleForm";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function RolesPage() {


  return (
    <AdminMainLayout>
      <div className="p-4">
      <h1 className="text-xl font-bold">Define Roles and Assign Corresponding Permissions</h1>

        <AddRoleForm />
      </div>
    </AdminMainLayout>
  );
}
