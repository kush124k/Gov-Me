"use client";
import Link from 'next/link';
import { 
  Target, 
  Lightbulb, 
  Github, 
  Linkedin, 
  Rocket,
  Cpu,
  ArrowRight,
  Users
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ------------------------------------------------------------------
// 📝 JUST ADD NAMES HERE
// ------------------------------------------------------------------
const TEAM_MEMBERS = [
  "Kushagra",
  "Madhu",
  "Chirantana",
  "Shubhankar" 
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">About Gov-Me</h1>
          <p className="text-lg text-slate-500">
            Bridging the gap between the taxes you pay and the benefits you deserve. 
            <span className="block font-semibold text-indigo-600 mt-1">Tracking Duty. Discovering Rights.</span>
          </p>
        </div>

        {/* SECTION 1: MISSION */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">Our Vision</Badge>
            <h2 className="text-2xl font-bold text-slate-800">Why We Built This</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="border-t-4 border-t-indigo-500 shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-indigo-700 flex items-center gap-2">
                  <Target className="w-5 h-5"/> The Core Problem
                </CardTitle>
                <CardDescription>Complexity is the enemy of utilization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>
                  Millions of rupees in government schemes go unclaimed every year simply because the average citizen cannot navigate the bureaucracy.
                </p>
                <p>
                  We believe that if you contribute to the nation's growth through <strong>Duty (Taxes)</strong>, you should effortlessly access your <strong>Rights (Schemes)</strong>.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-600"/> Born at Finhack 2025
                </h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <p>
                    Gov-Me started as a rapid prototype during the Finhack 2025 hackathon. What began as a simple visualizer has evolved into a comprehensive platform for civic engagement.
                  </p>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-500">Current Status</span>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">Round 2 Qualified</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* SECTION 2: TECH STACK */}
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-4 justify-center">
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Under the Hood</Badge>
            <h2 className="text-2xl font-bold text-slate-800">Built for Scale</h2>
          </div>

          <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
            
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Cpu className="w-12 h-12 mx-auto text-orange-400 mb-2" />
              <h3 className="text-2xl md:text-3xl font-bold">
                Powered by Modern Web Tech
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
                We leverage the latest in full-stack development to ensure real-time data visualization and secure user sessions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                  <div className="text-orange-400 font-bold text-lg mb-1">Next.js 14</div>
                  <div className="text-xs text-slate-300">App Router</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                  <div className="text-blue-400 font-bold text-lg mb-1">Python</div>
                  <div className="text-xs text-slate-300">Data Engine</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                  <div className="text-emerald-400 font-bold text-lg mb-1">Tailwind</div>
                  <div className="text-xs text-slate-300">UI/UX</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* SECTION 3: THE TEAM (SIMPLIFIED) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
             <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">Who We Are</Badge>
            <h2 className="text-2xl font-bold text-slate-800">Meet the Builders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Student-Led Innovation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are a team of undergraduates passionate about Open Source, Public Policy, and Software Engineering.
              </p>
              
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mt-4">
                 <h4 className="font-bold text-emerald-800 text-sm mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2"/> Our Focus
                 </h4>
                 <ul className="space-y-2 text-sm text-emerald-700 list-disc list-inside">
                    <li>Open Data Accessibility</li>
                    <li>Algorithmic Transparency</li>
                    <li>User-Centric Design</li>
                 </ul>
              </div>
            </div>

            {/* DYNAMIC TEAM GRID */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {TEAM_MEMBERS.map((name, index) => (
                 <Card key={index} className="hover:shadow-md transition-shadow flex items-center p-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                        {/* To add real images, put files named "Kushagra Singh.jpg" in public/team folder 
                           and uncomment the src line below:
                        */}
                        {/* <AvatarImage src={`/team/${name}.jpg`} /> */}
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                          {name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div className="ml-4 space-y-1">
                        <h3 className="font-bold text-slate-800">{name}</h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-medium">Team Gov-Me</span>
                             <div className="flex gap-2 border-l pl-3 border-slate-200">
                                <Link href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                                  <Github className="w-4 h-4"/>
                                </Link>
                                <Link href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
                                  <Linkedin className="w-4 h-4"/>
                                </Link>
                            </div>
                        </div>
                    </div>
                 </Card>
               ))}

               {/* Contribute Card */}
               <Card className="sm:col-span-2 bg-slate-50 border-dashed border-2">
                 <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900">Open Source & Ready</h4>
                        <p className="text-sm text-slate-500">Check out our repository.</p>
                    </div>
                    <Link href="https://github.com/kush124k/Gov-Me">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        View GitHub <ArrowRight className="ml-2 w-4 h-4"/>
                    </Button>
                    </Link>
                 </CardContent>
               </Card>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}