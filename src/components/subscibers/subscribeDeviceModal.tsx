"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api_url } from "../../../utils/apiCall";
import Loader from "../../../loader/loader";

interface Device {
  _id: string;
  deviceId: string;
  deviceName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed: () => void;
  subscriberId: string;
}

export default function SubscribeDeviceModal({
  isOpen,
  onClose,
  onSubscribed,
  subscriberId,
}: Props) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const selectedDevice = devices.find((d) => d._id === selectedDeviceId);

  const fetchDevices = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}get/all/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search: "" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDevices(data);
    } catch (err) {
      const error = err as Error;

      toast.error(error.message || "Failed to fetch devices");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedDeviceId) {
      toast.error("Please select a device.");
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}admin/subscribe/device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriberId,
          deviceId: selectedDeviceId,
          documentUrl: "", // Assuming deviceId is used as documentUrl
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Device subscribed successfully!");
      setSelectedDeviceId("");
      onSubscribed();
      onClose();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Subscription failed.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDevices();
      setSelectedDeviceId("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <h1 className="text-lg font-bold mb-4">Subscribe Device</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-5 text-sm">
            <div>
              <label className="block font-medium mb-1">Select Device</label>
              <select
                className="w-full border px-3 py-2 rounded mb-4"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                <option value="">-- Choose a device NAME --</option>
                {devices.map((device) => (
                  <option key={device._id} value={device._id}>
                    {device.deviceName}
                  </option>
                ))}
              </select>

              {selectedDeviceId && (
                <div>
                  <label className="block font-medium mb-1">Device ID</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
                    value={
                      devices.find((device) => device._id === selectedDeviceId)
                        ?.deviceId || ""
                    }
                    readOnly
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedDeviceId) {
                    toast.error("Please select a device.");
                    return;
                  }
                  setShowConfirm(true);
                }}
                disabled={submitting}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </div>
        )}

        {/* ✅ Confirm Modal inside modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Confirm Subscription
              </h2>
              <p className="text-sm mb-6">
                Subscribe <strong>{selectedDevice?.deviceName}</strong> to this
                subscriber?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleSubscribe();
                  }}
                  className="px-4 py-2 text-sm bg-black text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
