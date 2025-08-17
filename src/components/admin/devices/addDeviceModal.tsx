"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";

interface DeviceInput {
  deviceName: string;
  deviceId: string;
  type: string;
  manufacturer?: string;
  modelNumber?: string;
  capacity: string;
  status: "Active" | "Inactive";
  notes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddDeviceModal({ isOpen, onClose, onAdd }: Props) {
  const [form, setForm] = useState<DeviceInput>({
    deviceName: "",
    deviceId: "",
    type: "",
    manufacturer: "",
    modelNumber: "",
    capacity: "",
    status: "Active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        deviceName: "",
        deviceId: "",
        type: "",
        manufacturer: "",
        modelNumber: "",
        capacity: "",
        status: "Active",
        notes: "",
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.deviceName || !form.type || !form.capacity || !form.status) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      await axios.post(`${api_url}admin/add/device`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Device added successfully");
      onAdd();
      onClose();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };

      toast.error(error.response?.data?.message || "Failed to add device");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add New Device</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <InputField
            label="Device Name *"
            name="deviceName"
            value={form.deviceName}
            onChange={handleChange}
          />
          <InputField
            label="Device ID *"
            name="deviceId"
            value={form.deviceId}
            onChange={handleChange}
          />
          <SelectField
            label="Type *"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={["Solar Panel"]}
          />
          <InputField
            label="Manufacturer"
            name="manufacturer"
            value={form.manufacturer || ""}
            onChange={handleChange}
          />
          <InputField
            label="Model Number"
            name="modelNumber"
            value={form.modelNumber || ""}
            onChange={handleChange}
          />
          <InputField
            label="Capacity (kW) *"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
          />
          <SelectField
            label="Status *"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={["Active", "Inactive"]}
          />
          <TextAreaField
            label="Notes"
            name="notes"
            value={form.notes || ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Adding..." : "Add Device"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
        placeholder={`Enter ${label}`}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full border px-3 py-2 rounded resize"
        placeholder={`Enter ${label}`}
      ></textarea>
    </div>
  );
}
