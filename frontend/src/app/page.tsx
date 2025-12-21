'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 md:p-24 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: The "Yap" & Heading */}
        <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              Gov&Me<span className="text-blue-600">.</span>
            </h1>
            <p className="text-zinc-500 text-xl font-medium ml-1 tracking-widest uppercase">
              Tracking Duty. Discovering Rights.
            </p>
          </div>
          
          <div className="max-w-md space-y-4">
            <p className="text-zinc-400 leading-relaxed text-lg">
              Most citizens understand their <span className="text-white font-bold">Duty</span>—the taxes they owe the state. 
              But few understand their <span className="text-white font-bold">Rights</span>—the subsidies, grants, and benefits the state owes them.
            </p>
            <p className="text-zinc-500 text-sm italic border-l-2 border-zinc-800 pl-4">
              "Gov&Me is your fiscal thought-partner, bridging the gap between tax compliance and social contract benefits."
            </p>
          </div>

          <Link href="/calculate">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 h-14 text-lg font-bold mt-4 transition-all hover:scale-105">
              Launch Analysis Engine →
            </Button>
          </Link>
        </div>

        {/* Right Side: The "Bullshit" Summary (Accordion Style) */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl animate-in fade-in slide-in-from-right-8 duration-1000">
          <h2 className="text-blue-500 font-bold text-xl mb-6">Core Philosophies</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-zinc-800">
              <AccordionTrigger className="text-zinc-300 hover:text-white">Why Duty vs. Rights?</AccordionTrigger>
              <AccordionContent className="text-zinc-500">
                Taxation isn't a one-way street. We believe every rupee of duty paid should be balanced by an awareness of the rights and subsidies available to you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-zinc-800">
              <AccordionTrigger className="text-zinc-300 hover:text-white">The Citizen's Dashboard</AccordionTrigger>
              <AccordionContent className="text-zinc-500">
                Designed for Individuals, HUFs, and Corporations alike. Our engine handles complex calculations so you don't have to.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-zinc-800">
              <AccordionTrigger className="text-zinc-300 hover:text-white">Real-Time Fiscal Intelligence</AccordionTrigger>
              <AccordionContent className="text-zinc-500">
                Connected directly to a FastAPI backend for accurate, instant analysis based on the latest 2025 Budget provisions.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </main>
  )
}