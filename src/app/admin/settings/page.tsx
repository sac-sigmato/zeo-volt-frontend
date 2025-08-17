"use client"
import AdminMainLayout from "@/components/layout/adminLayout";
import Link from "next/link";

const settingsItems = [
  { title: "Centers & Locations", description: "Manage cities, areas, and centers", href: "/admin/settings/locations" },
  { title: "Center Admins", description: "Manage Center admins", href: "/admin/settings/centerAdmin/list" },
  { title: "Skills & Categories", description: "Add or update skill types", href: "/admin/settings/skills" },
  { title: "Business Verticals", description: "Configure verticals like Camps, Workshops", href: "/admin/settings/verticals" },
  { title: "Package Plans", description: "Define 1/3/6/12 month packages", href: "/admin/settings/plans" },
  { title: "Batch Timings", description: "Set days & time blocks for batches", href: "/admin/settings/batches" },
  { title: "Mentor Registry", description: "Assign and manage mentor profiles", href: "/admin/settings/mentors" },
  { title: "Subscription Statuses", description: "Control active/inactive/on-hold options", href: "/admin/settings/statuses" },
  { title: "Assessment Criteria", description: "Define monthly evaluation parameters", href: "/admin/settings/assessments" },
  { title: "Center Transfers", description: "Manage student movements between centers", href: "/admin/settings/transfers" }

];

export default function SettingsPage() {
  return (
    <AdminMainLayout>

    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ERP Master Settings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border p-4 rounded-lg shadow hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
    </AdminMainLayout>
  );
}
