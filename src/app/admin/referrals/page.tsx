"use client";

import ReferralsTable from "@/components/admin/rolesManagemnt/referralsTable";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function ReferralsPage() {
  return (
    <AdminMainLayout>
      <div className="space-y-6">
        <h2 className="text-[22px] font-bold mb-[10px]">Referrals</h2>
        <ReferralsTable />
      </div>
    </AdminMainLayout>
  );
}
