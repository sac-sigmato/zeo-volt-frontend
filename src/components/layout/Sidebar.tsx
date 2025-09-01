import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle2,
  Users2,
  ShieldCheck,
  UserSquare,
  Presentation,
  User,
  Table
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Devices", href: "/admin/devices", icon: Presentation },
  { label: "Subscribers", href: "/admin/subscribers", icon: UserCircle2 },
  { label: "Tickets", href: "/admin/tickets", icon: Table },
  // Tech person management
  { label: "Tech Persons", href: "/admin/techPersons", icon: User },
  {
    label: "Roles Management",
    href: "/admin/rolesManagament",
    icon: ShieldCheck,
  },
  { label: "Referrals", href: "/admin/referrals", icon: Users2 },
  { label: "My Profile", href: "/admin/myProfile", icon: UserSquare },
];

export default function Sidebar() {
  const currentPath = usePathname();

  return (
    <aside className="w-64 bg-white text-black h-screen sticky top-0 border-r border-gray-200 flex flex-col">
      <div className="px-6 py-4 font-bold text-xl border-b border-gray-200">
        Zeo Volt
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-2">
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = currentPath === href;
            const linkClasses =
              "flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-100 transition-all" +
              (isActive ? " bg-gray-200 font-semibold" : "");

            return (
              <li key={href}>
                <Link href={href} className={linkClasses}>
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
