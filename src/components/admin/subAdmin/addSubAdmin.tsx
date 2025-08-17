"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
interface Role {
  _id: string;
  name: string;
}
export default function AddSubAdminForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Active");

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${api_url}admin/get/role/by/SubAdmin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to load role(s)");
          return;
        }

        const roleArray = Array.isArray(data) ? data : [data];
        setRoles(roleArray);

        if (roleArray.length === 1) {
          setSelectedRole(roleArray[0]._id);
        }
      } catch (err) {
        toast.error("Error fetching role(s)");
        console.error(err);
      }
    };

    fetchRoles();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !selectedRole) {
      toast.error("All fields are required.");
      return;
    }

    const payload = { name, email, password, status, roleId: selectedRole };

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}admin/subAdmin/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add Sub Admin");
        return;
      }

      toast.success("Sub Admin added successfully");
      router.push("/admin/subAdmin/list");
      setName("");
      setEmail("");
      setPassword("");
      setStatus("Active");
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="*Full Name"
          placeholder="e.g., Meena Joshi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="*Email Address"
          placeholder="e.g., meena@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="*Password"
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      {/* Role Selection */}
      {roles.length > 0 && (
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Role Type</label>
          {roles.length === 1 ? (
            <input
              type="text"
              value={roles[0].name}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-sm font-medium"
            />
          ) : (
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push("/admin/subAdmin/list")}
          className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus />
          Add Sub Admin
        </button>
      </div>
    </div>
  );
}

// Reusable input field
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
      <label className="text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm"
      />
    </div>
  );
}

// Reusable select field
function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const textColor =
    value === "Active"
      ? "text-green-600"
      : value === "Inactive"
      ? "text-red-500"
      : "text-gray-800";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm ${textColor}`}
      >
        <option value="">Select</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
