"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { api_url } from "../../../utils/apiCall";

export interface SubscriberInput {
  name: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  fullAddress: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddSubscriberModal({ isOpen, onClose, onAdd }: Props) {
  const [form, setForm] = useState<SubscriberInput>({
    name: "",
    phone: "",
    email: "",
    city: "",
    area: "",
    pincode: "",
    fullAddress: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        area: "",
        pincode: "",
        fullAddress: "",
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Special rule for phone field: only digits, max 10 characters
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, ""); // Remove non-digit characters
      if (digitsOnly.length > 10) return; // Limit to 10 digits
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    // const pinRegex = /^[0-9]{6}$/;

    if (!form.name || !nameRegex.test(form.name.trim())) {
      toast.error(
        "Name is required and must contain only alphabets and spaces."
      );
      return false;
    }
    if (!form.phone || !phoneRegex.test(form.phone)) {
      toast.error("Phone must be a 10-digit number.");
      return false;
    }
    if (!form.email || !emailRegex.test(form.email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!form.city || !form.area) {
      toast.error("City and Area are required.");
      return false;
    }
    // if (!form.pincode || !pinRegex.test(form.pincode)) {
    //   toast.error("Pincode must be 6 digits.");
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");

      await axios.post(`${api_url}add/subscribers`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Subscriber added successfully");
      onAdd();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add subscriber");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add New Subscriber</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-medium">Subscriber ID *</label>
            <input
              type="text"
              name="subId"
              readOnly
              placeholder="System generated"
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <InputField
            label="Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <div>
            <label className="block font-medium">Phone *</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              placeholder="Enter phone"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <InputField
            label="Email *"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Area *"
            name="area"
            value={form.area}
            onChange={handleChange}
          />
          <InputField
            label="City *"
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <InputField
            label="Pincode *"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
          />
          <div>
            <label className="block font-medium">Full Address</label>
            <textarea
              name="fullAddress"
              value={form.fullAddress}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 rounded resize"
              placeholder="Enter full address"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 flex-wrap">
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
            {loading ? "Adding..." : "Add Subscriber"}
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase().replace("*", "").trim()}`}
        className="w-full border px-3 py-2 rounded"
      />
    </div>
  );
}
