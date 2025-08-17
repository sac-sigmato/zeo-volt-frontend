import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { api_url } from "../../../utils/apiCall";
import { useUserStore } from "../../../store/useUserStore";

export default function UserMenu() {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const [userName, setUserName] = useState<string>("...");
  const [userRole, setUserRole] = useState<string>("...");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = sessionStorage.getItem("token");
      const userStore = JSON.parse(
        sessionStorage.getItem("bloom_erp_user_store") || "{}"
      );
      const userId = userStore?.state?.user?._id;
      const userRole = userStore?.state?.user?.userRole;
      const normalizedRole = userRole?.toLowerCase();

      if (!userId || !token || !normalizedRole) return;

      const endpoint =
        normalizedRole === "superadmin"
          ? `superAdmin/get/by/${userId}`
          : `admin/subAdmin/get/by/${userId}`;

      try {
        const res = await axios.get(`${api_url}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data?.superAdmin || res.data || {};
        setUserName(user.name || "Unknown");
        setUserRole(user.userRole || userRole);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message: string }>;
        const message = error.response?.data?.message || "Failed to load user";
        toast.error(message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    logout();
    sessionStorage.clear();
    toast.success("Logged out successfully!");
    router.push("/admin/login");
  };

  return (
    <div className="flex items-center gap-4 p-2 rounded-md bg-gray-50 border border-gray-200 shadow-sm">
      <div className="hidden sm:flex flex-col items-end text-sm leading-tight">
        <span className="font-semibold text-gray-800 capitalize">{userName}</span>
        <span className="text-gray-500 text-xs pt-1">{userRole}</span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}
