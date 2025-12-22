'use client'

import Link from "next/link"
import { MoreVertical, Home, Calculator, Briefcase, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function GlobalNav() {
  return (
    <div className="fixed top-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-neutral-600 bg-white hover:bg-zinc-100 border-zinc-200">
            <MoreVertical className="h-5 w-5 text-zinc-600" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <DropdownMenuLabel className="text-zinc-600 font-extrabold font-mono font-stretch-expanded text-2xl uppercase tracking-wider">
            Navigation
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2 cursor-pointer py-2">
              <Home className="h-4 w-4" /> Home
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/calculate" className="flex items-center gap-2 cursor-pointer py-2">
              <Calculator className="h-4 w-4" /> Tax Calculator
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/investments" className="flex items-center gap-2 cursor-pointer py-2">
              <Calculator className="h-4 w-4" /> Investment Analysis
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/schemes" className="flex items-center gap-2 cursor-pointer py-2">
              <Briefcase className="h-4 w-4" /> Gov Subsidies & Schemes
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/policy-impact" className="flex items-center gap-2 cursor-pointer py-2">
              <FileText className="h-4 w-4" /> Policy Impact
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/About Site" className="flex items-center gap-2 cursor-pointer py-2">
              <Settings className="h-4 w-4" /> About Site
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}