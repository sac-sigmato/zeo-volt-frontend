"use client";

import AddSubAdminForm from "@/components/admin/subAdmin/addSubAdmin";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function SubAdminPage() {
  return (
    <AdminMainLayout>
      <div className="p-4">
        <h1 className="text-xl font-bold">Add Subadmin</h1>

        <AddSubAdminForm />
      </div>
    </AdminMainLayout>
  );
}
