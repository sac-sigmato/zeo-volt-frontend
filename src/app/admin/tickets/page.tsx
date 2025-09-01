"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Plus } from "lucide-react";
import AdminMainLayout from "@/components/layout/adminLayout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api_url } from "../../../../utils/apiCall";
import Loader from "../../../../loader/loader";
import EditTicketModal from "@/components/tickets/editTicketModal";

interface Ticket {
  _id: string;
  ticketId: string;
  subscriberName: string;
  subscriberPhone: string;
  device: {
    deviceId: string;
    deviceName: string;
  };
  description: string;
  status: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

   const fetchTickets = useCallback(async () => {
     try {
       setLoading(true);
       const token = sessionStorage.getItem("token");
       const res = await fetch(`${api_url}get/all/tickets`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ search }),
       });
       const data = await res.json();
       console.log(data);

       if (!res.ok) throw new Error(data.message);
       setTickets(data);
     } catch (err) {
       const error = err as Error;
       toast.error(error.message || "Failed to load tickets");
     } finally {
       setLoading(false);
     }
   }, [search]);

   useEffect(() => {
     const delayDebounce = setTimeout(() => {
       fetchTickets();
     }, 400);

     return () => clearTimeout(delayDebounce);
   }, [fetchTickets]);

  

  return (
    <AdminMainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold mb-4">Tickets</h1>
          <button
            onClick={() => router.push("/admin/tickets/add")}
            className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add New Ticket
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ticket ID, name or phone"
            className="border px-4 py-2 rounded w-full md:w-1/3 text-sm shadow-sm"
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subscriber Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subscriber Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {tickets.length > 0 ? (
                  tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.ticketId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.subscriberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.subscriberPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.device?.deviceId} - {t.device?.deviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {t.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            t.status === "Open"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setCurrentTicket(t);
                            setShowEditModal(true);
                          }}
                          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-400 text-sm"
                    >
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <EditTicketModal
          isOpen={showEditModal}
          ticket={currentTicket}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchTickets}
        />
      </div>
    </AdminMainLayout>
  );
}
