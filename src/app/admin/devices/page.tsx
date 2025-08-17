"use client";

import { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import AddDeviceModal from "@/components/admin/devices/addDeviceModal";
import Link from "next/link";
import Loader from "../../../../loader/loader";
import { AxiosError } from "axios";

interface Device {
  _id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  manufacturer?: string;
  modelNumber?: string;
  capacity: string;
  status: "Active" | "Inactive";
  notes?: string;
  createdAt?: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDevices = async (searchValue = "") => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}get/all/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search: searchValue }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setDevices(data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDevices(search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <AdminMainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Devices</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add New Device
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by device ID, name, or type"
            className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
          />
        </div>

        <div className="overflow-auto rounded-lg">
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : devices.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Device ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {devices.map((device) => (
                  <tr key={device._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.deviceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.deviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.manufacturer || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.capacity} kW
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          device.status === "Active"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/devices/${device._id}`}
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
            <p className="text-center py-6 text-gray-400">No devices found.</p>
          )}
        </div>

        <AddDeviceModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={() => {
            setShowModal(false);
            fetchDevices();
          }}
        />
      </div>
    </AdminMainLayout>
  );
}
