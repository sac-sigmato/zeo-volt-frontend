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

export default function SubscriberSubscriberDeviceDetailsPage() {
    const { id } = useParams();

  // Always call hooks first
  const [showPointForm, setShowPointForm] = useState(false);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(false);

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

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Sun Smiles of the Subscribers
              </h1>
              <span className="ml-2 text-lg font-medium bg-gray-200 text-gray-700 px-5 py-2 rounded-full select-none">
                Total: {subscriber?.sunSmiles ?? 0}
              </span>
            </div>{" "}
            <button
              onClick={() => setShowPointForm(true)}
              className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
              title={`Total Sun Smiles: ${subscriber?.sunSmiles ?? 0}`}
            >
              + Add Sun Smiles
            </button>
          </div>

          {/* Show points list */}
          {subscriber?.points && subscriber.points.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Month/Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Power Generated (kW)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriber.points.map((point) => (
                  <tr key={point._id} className="bg-white hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {point.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {point.month} {point.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {point.powerGenerated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{point.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No points found for this subscriber.</p>
          )}
        </div>

        {showPointForm && (
          <AddPointForm
            subscriberId={id}
            api_url={api_url}
            onCancel={() => setShowPointForm(false)}
            setShowPointForm={setShowPointForm}
            onSuccess={() => {
              setShowPointForm(false);
              fetchSubscriber();
            }}
          />
        )}
      </div>
    </AdminMainLayout>
  );
}
