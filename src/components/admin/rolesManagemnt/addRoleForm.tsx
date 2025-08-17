"use client";

import { api_url } from "../../../../utils/apiCall";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Permission = {
  _id: string;
  name: string;
};

export default function AddRoleForm() {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${api_url}admin/getAllPermissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setPermissions(data);
      } catch (err) {
        const error = err as Error;
        toast.error("Failed to load permissions");
        console.error(error.message);
      }
    };

    fetchPermissions();
  }, []);

  const handleSave = async () => {
    if (!roleName.trim()) {
      toast.error("Please enter Role Name.");
      return;
    }

    const payload = {
      name: roleName,
      description,
      status,
      permissions: selectedPermissions, // permission IDs
    };

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}admin/addRole`, {
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

      toast.success("Role added successfully");
      router.push("/admin/roles/list");
      setRoleName("");
      setDescription("");
      setStatus("Active");
      setSelectedPermissions([]);
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="*Role Name"
          placeholder="e.g., Manager"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>

      <TextArea
        label="Description"
        placeholder="Describe the role"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Assign Permissions</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {permissions.map((perm) => (
            <label key={perm._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(perm._id)}
                onChange={() => togglePermission(perm._id)}
              />
              {perm.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => router.push("/admin/roles/list")}
          className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          <Plus />
          Add Role
        </button>
      </div>
    </div>
  );
}

// Input, TextArea, Select same as before

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
      <label className="text-sm font-medium mb-2">{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm resize-none"
      />
    </div>
  );
}

// function Select({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// }) {
//   const textColor =
//     value === "Active"
//       ? "text-[#118d57]"
//       : value === "Inactive"
//       ? "text-[#e77620]"
//       : "text-gray-400";

//   return (
//     <div className="flex flex-col">
//       <label className="text-sm font-medium mb-2">{label}</label>
//       <select
//         value={value}
//         onChange={onChange}
//         className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-sm ${textColor}`}
//       >
//         <option value="">Select</option>
//         <option value="Active">Active</option>
//         <option value="Inactive">Inactive</option>
//       </select>
//     </div>
//   );
// }
