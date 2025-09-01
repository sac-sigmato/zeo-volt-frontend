"use client";

import ReferralsTable from "@/components/admin/rolesManagemnt/referralsTable";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function ReferralsPage() {
  return (
    <AdminMainLayout>
      <div className="flex flex-col gap-6 w-full mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Referrals
          </h1>
        </div>
        <ReferralsTable />
      </div>
    </AdminMainLayout>
  );
}
