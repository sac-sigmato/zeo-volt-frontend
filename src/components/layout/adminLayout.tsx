import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminMainLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen font-sans bg-white text-black">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
