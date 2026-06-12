import { useLocation, useNavigate } from "react-router-dom";
import { Map, MessageCircle, Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const TABS = [
  { path: "/", label: "지도", icon: Map },
  { path: "/chat", label: "채팅", icon: MessageCircle },
  { path: "/setting", label: "설정", icon: Settings },
] as const;

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[600px] -translate-x-1/2 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
                active ? "text-primary-foreground" : "text-gray-dark",
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
