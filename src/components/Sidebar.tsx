"use client";

import { LayoutDashboard, LogOut, Upload, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/add", icon: UserPlus, label: "Add User" },
  { href: "/dashboard/addMany", icon: Upload, label: "Bulk Upload" },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast("Logged out successfully", "success");
      router.push("/");
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
        <span className="text-base font-semibold text-gray-900">User Management</span>
        {onClose && (
          <button
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" ||
                (pathname.startsWith("/dashboard/") &&
                  pathname !== "/dashboard/add" &&
                  pathname !== "/dashboard/addMany")
              : pathname === item.href;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
          disabled={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
