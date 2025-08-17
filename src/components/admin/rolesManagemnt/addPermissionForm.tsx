"use client";

import { api_url } from "../../../../utils/apiCall";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddPermissionForm() {
  const [permissionName, setPermissionName] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const router = useRouter();
  const handleSave = async () => {
    if (!permissionName.trim()) {
      toast.error("Please enter the Permission Name.");
      return;
    }

    const payload = {
      name: permissionName,
      description: permissionDescription,
      status,
    };

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${api_url}admin/addPermission`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Permission added successfully");
      router.push("/admin/permissions/list");
      setPermissionName("");
      setPermissionDescription("");
      setStatus("Active");
    } catch (error) {
      toast.error("Failed to connect to server");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="*Permission Name"
          placeholder="e.g., manage_users"
          value={permissionName}
          onChange={(e) => setPermissionName(e.target.value)}
        />
      </div>

      <TextArea
        label="Description"
        placeholder="Describe what this permission allows"
        value={permissionDescription}
        onChange={(e) => setPermissionDescription(e.target.value)}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
          onClick={() => {
            router.push(" /admin/permissions/list");
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus />
          Add Permission
        </button>
      </div>
    </div>
  );
}
function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-[14px]"
      />
    </div>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-2">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-[14px] resize-none"
      />
    </div>
  );
}
