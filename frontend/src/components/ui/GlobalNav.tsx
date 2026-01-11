'use client'

import Link from "next/link"
import { usePathname } from "next/navigation" // Optional: to highlight active page
import { Home, Calculator, Briefcase, FileText, Settings, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils" // Ensure you have this utility, or remove 'cn' usage

export function GlobalNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Financial Diary", href: "/financial-diary", icon: FileText },
    { name: "Tax Calculator", href: "/calculate", icon: Calculator },
    { name: "Investment Analysis", href: "/investments", icon: TrendingUp },
    { name: "Gov Subsidies", href: "/schemes", icon: Briefcase },
    { name: "Policy Impact", href: "/policy-impact", icon: FileText },
    { name: "About Site", href: "/About Site", icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full py-6">
      {/* Header inside the menu */}
      <div className="px-6 mb-8">
         <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Navigation
         </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-500" // Active State
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900" // Inactive State
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-white")} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      {/* Optional: Footer or user profile at bottom */}
      <div className="mt-auto px-6 pt-6 border-t border-zinc-900">
         <p className="text-xs text-zinc-600">
            © 2025 Gov&Me <br/> 
            Manipal Institute of Technology
         </p>
      </div>
    </div>
  )
}