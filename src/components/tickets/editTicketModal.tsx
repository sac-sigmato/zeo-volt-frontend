"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api_url } from "../../../utils/apiCall";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    _id: string;
    ticketId: string;
    subscriberName: string;
    subscriberPhone: string;
    status: string;
  } | null;
  onUpdated: () => void;
}

export default function EditTicketModal({ isOpen, onClose, ticket, onUpdated }: Props) {
  const [status, setStatus] = useState(ticket?.status || "");

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
    }
  }, [ticket]);

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${api_url}update/ticket/${ticket?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Ticket updated successfully");
      onClose();
      onUpdated();
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Failed to update ticket");
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Ticket</h2>
        <div className="text-sm space-y-4">
          <div>
            <div className="text-gray-500 font-medium">Ticket ID</div>
            <div className="text-gray-800">{ticket.ticketId}</div>
          </div>
          <div>
            <div className="text-gray-500 font-medium">Subscriber</div>
            <div className="text-gray-800">{ticket.subscriberName} ({ticket.subscriberPhone})</div>
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Status</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
