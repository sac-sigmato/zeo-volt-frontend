"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminMainLayout from "@/components/layout/adminLayout";
import { toast } from "sonner";
import { api_url } from "../../../../../utils/apiCall";
import Loader from "../../../../../loader/loader";
import Tabs from "../../../../../tabs/tabs";

interface Subscriber {
  _id: string;
  subId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  fullAddress?: string;
  referralCode?: string;
  createdAt?: string;
  status?: "Active" | "On Hold" | "Completed";
}

export default function SubscriberDetailPage() {
  const { id } = useParams();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Subscriber>>({});

  const fetchSubscriber = useCallback(async () => {
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

      const data: Subscriber | { message: string } = await res.json();
      if (!res.ok) {
        const errorData = data as { message: string };
        throw new Error(errorData.message || "Failed to fetch subscriber");
      }

      setSubscriber(data as Subscriber);
      setFormData(data as Subscriber);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch subscriber");
    } finally {
      setLoading(false);
    }
  }, [id]); // 👈 depends only on id

  useEffect(() => {
    if (id) fetchSubscriber();
  }, [id, fetchSubscriber]); // 👈 now safe

  const handleChange = (field: keyof Subscriber, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}update/subscriber/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update subscriber");
      }

      toast.success("Subscriber updated successfully");
      setIsEditing(false);
      fetchSubscriber();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Update failed");
    }
  };

  const tabs = [
    { label: "Details", href: `/admin/subscribers/${id}` },
    { label: "Device", href: `/admin/subscribers/${id}/subscribeDevice` },
    { label: "Sun Smiles", href: `/admin/subscribers/${id}/sunSmiles` },
    { label: "Maintenance", href: `/admin/subscribers/${id}/maintenance` },
  ];

  return (
    <AdminMainLayout>
      <div className="pt-6">
        {/* ✅ Tabs Full Width */}
        <div className="px-8">
          <Tabs tabs={tabs} />
        </div>

        {/* ✅ Keep the rest inside constrained card */}
        <div className="mx-8 p-4 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Subscriber Details
            </h1>
            {!loading && subscriber && (
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isEditing
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Details"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <Loader />
            </div>
          ) : !subscriber ? (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <p className="text-red-500 text-lg font-medium">
                Subscriber not found.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* All fields */}
                {(
                  [
                    ["Subscriber ID", "subId"],
                    ["Name", "name"],
                    ["Phone", "phone"],
                    ["Email", "email"],
                    ["City", "city"],
                    ["Area", "area"],
                    ["Pincode", "pincode"],
                    ["Full Address", "fullAddress"],
                    ["Referral Code", "referralCode"],
                  ] as [string, keyof Subscriber][]
                ).map(([label, field]) => (
                  <div
                    key={field}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                      {label}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={formData[field] || ""}
                        onChange={(e) => handleChange(field, e.target.value)}
                      />
                    ) : (
                      <div className="text-gray-900 font-medium text-lg">
                        {subscriber[field] || "-"}
                      </div>
                    )}
                  </div>
                ))}

                {/* Status field */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    Status
                  </div>
                  {isEditing ? (
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formData.status || ""}
                      onChange={(e) =>
                        handleChange("status", e.target.value as string)
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          subscriber.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : subscriber.status === "On Hold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            subscriber.status === "Active"
                              ? "bg-green-500"
                              : subscriber.status === "On Hold"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        {subscriber.status || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminMainLayout>
  );
}
