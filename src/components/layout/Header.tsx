import { Search } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4">
      {/* Search bar */}
      <div className="flex-1 relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name, subscriber ID or phone number"
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Right side: user menu */}
      <div className="flex items-center flex-wrap gap-4">
        <UserMenu />
      </div>
    </div>
  );
}