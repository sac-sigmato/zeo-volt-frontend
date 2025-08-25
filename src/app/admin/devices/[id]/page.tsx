"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminMainLayout from "@/components/layout/adminLayout";
import { toast } from "sonner";
import { api_url } from "../../../../../utils/apiCall";
import Loader from "../../../../../loader/loader";

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

export default function DeviceDetailPage() {
  const { id } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDevice = useCallback(async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}get/device/by/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: Device | { message?: string } = await res.json();
      if (!res.ok) {
        const errorData = data as { message?: string };
        throw new Error(errorData.message || "Failed to fetch device");
      }
      setDevice(data as Device);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch device");
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ dependency is now tracked

  useEffect(() => {
    if (id) fetchDevice();
  }, [id, fetchDevice]); // ✅ warning gone

  return (
    <AdminMainLayout>
      <div className="p-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Device Details</h1>

        {loading ? (
          <Loader />
        ) : !device ? (
          <p className="text-red-500">Device not found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Device ID", device.deviceId],
              ["Name", device.deviceName],
              ["Type", device.type],
              ["Manufacturer", device.manufacturer],
              ["Model Number", device.modelNumber],
              ["Capacity (kW)", device.capacity],
              ["Notes", device.notes],
              [
                "Created At",
                device.createdAt
                  ? new Date(device.createdAt).toLocaleString()
                  : "N/A",
              ],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="font-medium text-gray-600">{label}</div>
                <div className="text-gray-800">{value || "-"}</div>
              </div>
            ))}

            {/* Colored Status */}
            <div>
              <div className="font-medium text-gray-600">Status</div>
              <div
                className={`font-semibold ${
                  device.status === "Active" ? "text-green-500" : "text-red-500"
                }`}
              >
                {device.status || "N/A"}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminMainLayout>
  );
}
