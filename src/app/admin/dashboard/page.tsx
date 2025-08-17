"use client";

import { useEffect, useState } from "react";
import AdminMainLayout from "@/components/layout/adminLayout";
import {
  ActivitySquare,
  Users,
  ClipboardList,
  Layers,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";

interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bg: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);

  const fetchStats = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}admin/dashboard-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStats([
        {
          title: "Total Devices",
          value: data.deviceCount,
          icon: Layers,
          bg: "bg-purple-100",
        },
        {
          title: "Total Subscribers",
          value: data.subscriberCount,
          icon: Users,
          bg: "bg-blue-100",
        },
        {
          title: "Total Tickets",
          value: data.ticketCount,
          icon: ClipboardList,
          bg: "bg-yellow-100",
        },
        {
          title: "Open Tickets",
          value: data.openTicketCount,
          icon: ActivitySquare,
          bg: "bg-pink-100",
        },
      ]);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminMainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Zeo Volt Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-lg p-4 shadow-sm border ${stat.bg}`}
            >
              <stat.icon className="w-10 h-10 text-gray-700" />
              <div>
                <div className="text-sm text-gray-600">{stat.title}</div>
                <div className="text-xl font-semibold text-black">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminMainLayout>
  );
}
