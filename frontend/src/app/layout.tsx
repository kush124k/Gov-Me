"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Landmark, Home } from "lucide-react";
import { GlobalNav } from "@/components/ui/GlobalNav"; 

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        
        {/* --- GLOBAL TOP BAR (BLACK THEME) --- */}
        {/* FIXED: Removed 'border-b border-slate-800' to remove the line */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950 h-16 shadow-xl flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
            
            {/* LEFT: Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
                <div className="p-1.5 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
                    <Landmark className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white tracking-tight text-lg">Gov&Me</span>
            </Link>

            {/* RIGHT: Controls */}
            <div className="flex items-center gap-4">
                
                {/* Back to Home Button */}
                <Link 
                  href="/" 
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>

                {/* Hamburger Menu Button */}
                <button 
                  onClick={toggleMenu}
                  className="p-2 -mr-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
                  aria-label="Open Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
            </div>

          </div>
        </nav>

        {/* --- SIDEBAR DRAWER (Black Theme) --- */}
        {/* Backdrop */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeMenu}
          />
        )}
        
        {/* Sliding Panel */}
        <div className={`fixed top-0 right-0 bottom-0 w-72 bg-zinc-950 z-50 shadow-2xl border-l border-zinc-800 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <span className="text-white font-semibold tracking-wide">Menu</span>
              <button onClick={closeMenu} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto" onClick={closeMenu}>
                <GlobalNav />
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-zinc-800">
               <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors text-sm font-medium">
                  <Home className="w-4 h-4" /> Back to Home
               </Link>
            </div>

          </div>
        </div>

        {/* --- PAGE CONTENT --- */}
        {/* FIXED: Changed pt-20 to pt-16 to perfectly match the 64px header height (h-16) */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>

      </body>
    </html>
  );
}