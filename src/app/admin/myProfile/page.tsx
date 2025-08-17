"use client";

import ProfileForm from "@/components/admin/profile/adminProfileForm";
import AdminMainLayout from "@/components/layout/adminLayout";

export default function ProfilePage() {
  return (
    <AdminMainLayout>
      <div className="space-y-6">
        <h2 className="text-[22px] font-bold mb-[10px]">Profile</h2>
          <ProfileForm />
      </div>
    </AdminMainLayout>
  );
}
