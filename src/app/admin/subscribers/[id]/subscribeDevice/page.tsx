"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminMainLayout from "@/components/layout/adminLayout";
import { toast } from "sonner";
import { api_url } from "../../../../../../utils/apiCall";
import Tabs from "../../../../../../tabs/tabs";
import Loader from "../../../../../../loader/loader";
import { Plus, X } from "lucide-react";
import SubscribeDeviceModal from "@/components/subscibers/subscribeDeviceModal";

interface Device {
  _id: string;
  deviceId: string;
  deviceName: string;
  type: string;
  modelNumber?: string;
  capacity: string;
}

interface SubscribedDevice {
  _id: string;
  device: Device;
  documentUrl?: string;
}

interface Subscriber {
  _id: string;
  subId: string;
  name: string;
  subscribedDevices: SubscribedDevice[];
}

export default function SubscriberSubscriberDeviceDetailsPage() {
  const { id } = useParams();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<SubscribedDevice | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchSubscriber = async () => {
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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch subscriber");
      }

      const data: Subscriber = await res.json();
      setSubscriber(data);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch subscriber");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSubscriber();
  }, [id]);

  const handleDocumentUpload = async () => {
    try {
      if (!selectedFile || !selectedDevice) return;

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("subscriberId", subscriber?._id || "");
      formData.append("deviceId", selectedDevice.device._id);
      console.log("api_url", api_url);

      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${api_url}admin/subscribe/device/upload-document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedSubscriber = await response.json();
        setSubscriber(updatedSubscriber);
        setShowUploadModal(false);
        setSelectedDevice(null);
        setSelectedFile(null);
        toast.success("Document uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
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
      <div className="p-6">
        <Tabs tabs={tabs} />
        <h1 className="text-2xl font-bold mb-4">
          Subscribed Devices Overview & Add New Device for Subscriber
        </h1>

        {loading ? (
          <Loader />
        ) : !subscriber ? (
          <p className="text-red-500">Subscriber not found.</p>
        ) : (
          <>
            {subscriber.subscribedDevices?.length > 0 ? (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Subscribed Devices</h2>
                  <button
                    onClick={() => setShowDeviceModal(true)}
                    className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" /> Subscribe New Device
                  </button>
                </div>
                <div className="overflow-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Device ID
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Model Number
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Capacity
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">
                          Document
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscriber.subscribedDevices.map((subscribedDevice) => (
                        <tr
                          key={subscribedDevice._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.device.deviceId}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.device.deviceName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.device.type}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.device.modelNumber || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.device.capacity} kW
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subscribedDevice.documentUrl ? (
                              <button
                                onClick={() =>
                                  setSelectedDocument(
                                    subscribedDevice.documentUrl
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedDevice(subscribedDevice);
                                  setShowUploadModal(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                Add
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-10 text-gray-500">
                <h2 className="text-lg font-semibold mb-2">
                  Subscribed Devices
                </h2>
                <p>No subscribed devices found.</p>
                <button
                  onClick={() => setShowDeviceModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" /> Subscribe New Device
                </button>
              </div>
            )}

            {/* Document Viewer Modal */}
            {selectedDocument && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Document Viewer</h3>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <iframe
                      src={selectedDocument}
                      className="w-full h-full border rounded"
                      title="Document Viewer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-1/2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Upload Document</h3>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedDevice(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload PDF Document (Max 5MB)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedDevice(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDocumentUpload}
                      disabled={!selectedFile}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                        !selectedFile
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <SubscribeDeviceModal
          isOpen={showDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          onSubscribed={fetchSubscriber}
          subscriberId={(id as string) || ""}
        />
      </div>
    </AdminMainLayout>
  );
}
