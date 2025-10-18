import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CreditCard, User } from "lucide-react";

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "工作台" },
  { path: "/wallet", icon: CreditCard, label: "我的钱包" },
  { path: "/profile", icon: User, label: "个人中心" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 relative",
                  isActive 
                    ? "text-primary bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full" />
                )}
                <div className="relative">
                  <Icon className={cn("mb-1 transition-all", isActive ? "w-6 h-6" : "w-5 h-5")} />
                </div>
                <span className={cn("text-xs", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}