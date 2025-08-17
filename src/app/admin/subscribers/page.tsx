"use client";
import { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";
import AddSubscriberModal from "@/components/subscibers/addSubscriberModal";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import Link from "next/link";
import Loader from "../../../../loader/loader";

interface Subscriber {
  _id: string;
  subId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  fullAddress: string;
  skill?: string;
  batch?: string;
  sessionsUsed?: number;
  sessionsTotal?: number;
  status?: "Active" | "On Hold" | "Completed";
}

export default function SubscribersPage() {
  const [search, setSearch] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchSubscribers = async (searchValue = "") => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}get/all/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search: searchValue }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubscribers(data);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSubscribers(search);
    }, 400); // debounce for 400ms

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <AdminMainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Subscribers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add New Subsciber
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Subscriber ID	, name , phone, or email"
            className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
          />
        </div>

        <div className="overflow-auto rounded-lg">
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : subscribers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Subscriber ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Area
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Pincode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{sub.subId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sub.area}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sub.pincode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/subscribers/${sub._id}`}
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-6 text-gray-400">
              No subscribers found.
            </p>
          )}
        </div>

        <AddSubscriberModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={() => {
            setShowModal(false);
            fetchSubscribers(); // Refresh the list after adding
          }}
        />
      </div>
    </AdminMainLayout>
  );
}
