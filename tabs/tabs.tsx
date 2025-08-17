"use client";

import { usePathname, useRouter } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex gap-6 border-b mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`pb-2 text-sm font-medium ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
