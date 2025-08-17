"use client";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import AdminMainLayout from "@/components/layout/adminLayout";
import Tabs from "../../../../../../tabs/tabs";
import AddPointForm from "@/components/subscibers/sunSmiles/addPointForm";
import { api_url } from "../../../../../../utils/apiCall";
import { toast } from "sonner";
import Loader from "../../../../../../loader/loader";

type Point = {
  _id: string;
  description: string;
  month: string;
  year: string;
  powerGenerated: number;
  points: number;
};

type Subscriber = {
  id: string;
  points: Point[];
  sunSmiles: number;
};

type MaintenanceBox = {
  id: number;
  title: string;
  date: string;
  status: 'pending' | 'completed';
};

export default function SubscriberSubscriberDeviceDetailsPage() {
  const { id } = useParams();

  // Always call hooks first
  const [showPointForm, setShowPointForm] = useState(false);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(false);

  const maintenanceYears = [2025, 2026, 2027];
  const maintenanceBoxes: Record<number, MaintenanceBox[]> = {
    2025: [
      { id: 1, title: "Maintenance 1", date: "Jan 2025", status: "completed" },
      { id: 2, title: "Maintenance 2", date: "Apr 2025", status: "completed" },
      { id: 3, title: "Maintenance 3", date: "Jul 2025", status: "pending" },
      { id: 4, title: "Maintenance 4", date: "Oct 2025", status: "pending" },
    ],
    2026: [
      { id: 1, title: "Maintenance 1", date: "Jan 2026", status: "pending" },
      { id: 2, title: "Maintenance 2", date: "Apr 2026", status: "pending" },
      { id: 3, title: "Maintenance 3", date: "Jul 2026", status: "pending" },
      { id: 4, title: "Maintenance 4", date: "Oct 2026", status: "pending" },
    ],
    2027: [
      { id: 1, title: "Maintenance 1", date: "Jan 2027", status: "pending" },
      { id: 2, title: "Maintenance 2", date: "Apr 2027", status: "pending" },
      { id: 3, title: "Maintenance 3", date: "Jul 2027", status: "pending" },
      { id: 4, title: "Maintenance 4", date: "Oct 2027", status: "pending" },
    ],
  };

  // Create a stable fetchSubscriber that does nothing if id invalid
  const fetchSubscriber = useCallback(async () => {
    if (!id || Array.isArray(id)) return; // <-- early return inside the hook, safe!

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}get/subscriber/by/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: Subscriber = await res.json();
      if (!res.ok) {
        const errData = data as unknown as { message: string };
        throw new Error(errData.message || "Failed to fetch subscriber");
      }

      setSubscriber(data);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch subscriber");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubscriber();
  }, [fetchSubscriber]);

  // Now check id, conditionally render error or main content
  if (!id || Array.isArray(id)) {
    return <div>Invalid subscriber ID</div>;
  }

  const tabs = [
    { label: "Details", href: `/admin/subscribers/${id}` },
    { label: "Device", href: `/admin/subscribers/${id}/subscribeDevice` },
    { label: "Sun Smiles", href: `/admin/subscribers/${id}/sunSmiles` },
    { label: "Maintenance", href: `/admin/subscribers/${id}/maintenance` },
  ];

  return (
    <AdminMainLayout>
      <div className="p-6 relative min-h-[400px]">
        <Tabs tabs={tabs} />

        {loading && <Loader />}

        <div className="mt-10 space-y-8">
          {maintenanceYears.map((year) => (
            <div key={year} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{year}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {maintenanceBoxes[year].map((box) => (
                  <div
                    key={box.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold">{box.title}</h3>
                    <p className="text-gray-600">{box.date}</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                        box.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {box.status.charAt(0).toUpperCase() + box.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminMainLayout>
  );
}