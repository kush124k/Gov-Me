'use client';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowRight, 
  Menu, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Search, 
  Scale 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import  {GlobalNav}  from "@/components/ui/GlobalNav"

// --- ANIMATION CONFIGURATION ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-900 selection:text-white">
      
{/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-md bg-black/60 border-b border-white/5">
        
        {/* LEFT SIDE: Logo & Brand */}
        <div className="flex items-center gap-3">
           <div className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
             G
           </div>
           <span className="text-xl font-bold tracking-tight">Gov&Me</span>
        </div>
        
        {/* RIGHT SIDE: Menu Trigger & Sidebar */}
        <Sheet>
          {/* The Button that you click */}
          <SheetTrigger asChild>
             <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2 rounded-full px-4">
                Menu <Menu className="w-5 h-5" />
             </Button>
          </SheetTrigger>

          {/* The Sidebar that slides out */}
          <SheetContent 
             side="right" 
             className="w-75 sm:w-100 bg-black text-white border-l border-zinc-800 p-0"
          >
             {/* The actual links component inside the sidebar */}
             <div className="h-full px-2">
                 <GlobalNav />
             </div>
          </SheetContent>
        </Sheet>
        
      </nav>
      <main className="flex flex-col items-center justify-center">
        
        {/* --- HERO SECTION --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl mx-auto px-6 pt-48 pb-32 text-center space-y-8"
        >
          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight">
            Tracking Duty. <br />
            {/* The Gradient Text Effect */}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 animate-gradient-x">
              Discovering Rights
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
            Most citizens understand their Duty—the taxes they owe the state. <br className="hidden md:block"/>
            But few understand their Rights—the subsidies, grants, and benefits the state owes them.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/financial-diary">
              <Button size="lg" className="h-14 px-8 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(37,99,235,0.6)]">
                Launch Financial Diary <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link href="/schemes">
               <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-medium border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-600 rounded-full bg-transparent transition-all">
                Scheme Finder
              </Button>
            </Link>
          </motion.div>
        </motion.div>


        {/* --- FEATURES GRID --- */}
        <div className="w-full bg-zinc-950/50 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 py-24 space-y-16">
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
            >
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Why Choose Gov&Me?</h2>
               <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Gov&Me is your fiscal thought-partner, bridging the gap between tax compliance and social contract benefits.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/financial-diary">
               <FeatureCard 
                  icon={<BookOpen className="w-6 h-6 text-blue-500" />}
                  title="Financial Diary"
                  desc="Track your income, deductions, investments, and assets in one structured place to understand your complete financial position."
                  bullets={["Consolidated view of income", "Year-wise tax planning", "Clear financial visualisation"]}
               />
               </Link>

              <Link href="/calculate">
               <FeatureCard 
                  icon={<Calculator className="w-6 h-6 text-green-500" />}
                  title="Tax Calculator"
                  desc="Instantly calculate how much tax you owe under current income tax rules without navigating complex government portals."
                  bullets={["Simple income-based tax calculation", "Auto-applied tax slabs", "Clear breakdown of logic"]}
               />
                </Link>

              <Link href="/investments">
               <FeatureCard 
                  icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                  title="Investment Analysis"
                  desc="Analyze capital gains across asset classes and understand your real post-tax investment returns."
                  bullets={["Short-term & Long-term gain classification", "Equity vs Mutual Fund analysis", "Latest tax rules applied"]}
               />
               </Link>

              <Link href="/schemes">
               <FeatureCard 
                  icon={<Search className="w-6 h-6 text-amber-500" />}
                  title="Scheme Finder"
                  desc="Discover government schemes and subsidies you are eligible for based on your personal and financial profile."
                  bullets={["Personalized eligibility discovery", "Clear benefit explanations", "Required document checklist"]}
               />
                </Link>

              <Link href="/policy-impact">
               <FeatureCard 
                  icon={<Scale className="w-6 h-6 text-rose-500" />}
                  title="Policy Impact"
                  desc="Understand how tax policies affect you personally by comparing old and new tax regimes with clear scenarios."
                  bullets={["Old vs New tax regime comparison", "Deduction tipping-point analysis", "Personalized recommendations"]}
               />
               </Link>
               {/* Last Card - Call to Action Style */}
               <div className="p-8 rounded-3xl border border-zinc-900 bg-linear-to-br from-zinc-900 to-black flex flex-col justify-center items-center text-center space-y-4">
                  <h3 className="text-xl font-bold text-white">Ready to take control?</h3>
                  <p className="text-zinc-400 text-sm">Start your journey towards financial clarity and rights awareness today.</p>
                  <Link href="/financial-diary">
                    <Button variant="secondary" className="w-full">Get Started Now</Button>
                  </Link>
               </div>
            </div>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="w-full border-t border-zinc-900 py-12 px-6 bg-black">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="bg-zinc-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-zinc-400">G</div>
                    <span>Gov&Me © 2025</span>
                </div>
                <div className="flex gap-8">
                    <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-zinc-400 cursor-pointer transition-colors">contact: gov.me@mit.edu</span>
                </div>
            </div>
        </footer>

      </main>
    </div>
  );
}

// --- HELPER COMPONENT FOR GRID CARDS ---
function FeatureCard({ icon, title, desc, bullets }: { icon: any, title: string, desc: string, bullets: string[] }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group p-8 rounded-3xl border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all duration-300"
        >
            <div className="mb-6 p-3 bg-zinc-950 rounded-2xl inline-block border border-zinc-800 group-hover:border-zinc-700 group-hover:scale-110 transition-transform shadow-lg">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {desc}
            </p>
            <ul className="space-y-3 border-t border-zinc-800/50 pt-4">
                {bullets.map((item, i) => (
                    <li key={i} className="flex items-start text-xs text-zinc-500">
                        <span className="mr-2 text-blue-500/50">•</span> {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}