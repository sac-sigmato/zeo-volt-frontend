import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Point {
  description: string;
  month: string;
  year: number | "";
  powerGenerated: number;
  points: number;
}

interface AddPointFormProps {
  onCancel: () => void;
  subscriberId: string;
  api_url: string;
  setShowPointForm: (show: boolean) => void;
  refreshPointsList?: () => void;
  onSuccess?: () => void;
}

export default function AddPointForm({
  onCancel,
  subscriberId,
  api_url,
  setShowPointForm,
  refreshPointsList,
  onSuccess,
}: AddPointFormProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - 20 + i);

  const [newPoint, setNewPoint] = useState<Point>({
    description: "",
    month: "",
    year: "",
    powerGenerated: 0,
    points: 0,
  });

  const [loading, setLoading] = useState(false); // <-- loading state

  const handlePointChange = (field: keyof Point, value: string | number) => {
    setNewPoint((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (loading) return; // prevent double submit

    try {
      // Validate required fields except description
      if (!newPoint.month) {
        toast.error("Please select a month");
        return;
      }
      if (!newPoint.year) {
        toast.error("Please select a year");
        return;
      }
      if (newPoint.powerGenerated <= 0) {
        toast.error("Please enter a valid power generated (greater than 0)");
        return;
      }
      if (newPoint.points <= 0) {
        toast.error("Please enter a valid points value (greater than 0)");
        return;
      }

      setLoading(true); // start loading

      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${api_url}subscriber/${subscriberId}/add/sunSmiles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPoint),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add point");
      }

      toast.success("Point added successfully");
      setShowPointForm(false);
      setNewPoint({
        description: "",
        month: "",
        year: "",
        powerGenerated: 0,
        points: 0,
      });

      refreshPointsList?.();
      onSuccess?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4">
        <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
          <h3 className="text-lg font-semibold mb-4">Add Sun Smiles</h3>

          <label
            htmlFor="description"
            className="block mb-1 font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Enter description"
            className="w-full mb-4 p-2 border rounded"
            value={newPoint.description}
            onChange={(e) => handlePointChange("description", e.target.value)}
            disabled={loading}
          />

          <label
            htmlFor="month"
            className="block mb-1 font-medium text-gray-700"
          >
            Month
          </label>
          <select
            id="month"
            value={newPoint.month}
            onChange={(e) => handlePointChange("month", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <label
            htmlFor="year"
            className="block mb-1 font-medium text-gray-700"
          >
            Year
          </label>
          <select
            id="year"
            value={newPoint.year}
            onChange={(e) => handlePointChange("year", Number(e.target.value))}
            className="w-full mb-4 p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <label
            htmlFor="powerGenerated"
            className="block mb-1 font-medium text-gray-700"
          >
            Power Generated (kW)
          </label>
          <input
            id="powerGenerated"
            type="number"
            placeholder="Enter power generated"
            className="w-full mb-4 p-2 border rounded"
            value={newPoint.powerGenerated}
            onChange={(e) =>
              handlePointChange("powerGenerated", Number(e.target.value))
            }
            disabled={loading}
          />

          <label
            htmlFor="points"
            className="block mb-1 font-medium text-gray-700"
          >
            Points
          </label>
          <input
            id="points"
            type="number"
            placeholder="Enter points"
            className="w-full mb-6 p-2 border rounded"
            value={newPoint.points}
            onChange={(e) =>
              handlePointChange("points", Number(e.target.value))
            }
            disabled={loading}
          />

          <div className="flex justify-end gap-2">
            <button
              className="inline-flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-400 disabled:opacity-50"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center gap-2 bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>Adding smiles...</>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Sun Smiles
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
