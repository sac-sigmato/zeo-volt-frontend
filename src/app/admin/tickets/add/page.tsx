"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminMainLayout from "@/components/layout/adminLayout";
import { api_url } from "../../../../../utils/apiCall";
import Loader from "../../../../../loader/loader";
import { useRouter } from "next/navigation";

interface Subscriber {
  _id: string;
  subId: string;
  name: string;
}

interface Device {
  _id: string;
  deviceId: string;
  deviceName: string;
}

export default function AddTicketPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const fetchSubscribers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}get/all/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSubscribers(data);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch subscribers");
    } finally {
      setLoadingSubs(false);
    }
  };

  const fetchDevices = async (subscriberId: string) => {
    setLoadingDevices(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}get/subscriber/by/${subscriberId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDevices(data.subscribedDevices || []);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch devices");
    } finally {
      setLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleSubscriberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSubscriber(value);
    setSelectedDevice("");
    if (value) fetchDevices(value);
  };

  const handleSubmit = async () => {
    if (!selectedSubscriber || !selectedDevice || !description.trim()) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}create/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriberId: selectedSubscriber,
          deviceId: selectedDevice,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Ticket created successfully.");
      router.push("/admin/tickets");
      setSelectedSubscriber("");
      setSelectedDevice("");
      setDescription("");
      setDevices([]);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminMainLayout>
      <div className="p-6 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Create New Support Ticket</h1>

        {loadingSubs ? (
          <Loader />
        ) : (
          <div className="space-y-5">
            {/* Subscriber Select */}
            <div>
              <label className="block font-medium mb-1">
                Select Subscriber
              </label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={selectedSubscriber}
                onChange={handleSubscriberChange}
              >
                <option value="">-- Choose Subscriber --</option>
                {subscribers.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.subId} - {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Select */}
            {loadingDevices ? (
              <Loader />
            ) : (
              selectedSubscriber && (
                <div>
                  <label className="block font-medium mb-1">
                    Select Device
                  </label>
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                  >
                    <option value="">-- Choose Device --</option>
                    {devices.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.deviceId} - {d.deviceName}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">
                Message / Description
              </label>
              <textarea
                rows={4}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter issue description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setSelectedSubscriber("");
                  setSelectedDevice("");
                  setDescription("");
                  setDevices([]);
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                {submitting ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminMainLayout>
  );
}
