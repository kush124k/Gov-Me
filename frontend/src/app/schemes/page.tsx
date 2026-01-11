'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js'; 
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, SearchX, Filter } from 'lucide-react';
import { DigiLockerIcon } from '@/components/ui/DigiLockerIcon';

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATIC_FILTERS = {
    types: ["Central"],
    categories: ["Cash transfer", "Education subsidy", "Financial Inclusion", "Insurance", "Pension", "Savings", "Skill Devleopment", "Subsidy", "Tax Benefit"],
    genders: ["All", "Male", "Female", "Transgender"],
    occupations: ["Any", "Household", "Informal sector", "Landholding farmer", "Pensioner", "Salaried", "Self-employed", "Senior citizen", "Student", "Unemployed", "Unorganised worker"],
    income_thresholds: ["All", "BPL", "Upto ₹2,00,000", "Upto ₹3,00,000"]
};

export default function SchemesPage() {
  // --- STATE ---
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [age, setAge] = useState(25)
  const [gender, setGender] = useState("All")
  const [category, setCategory] = useState("All")
  const [occupation, setOccupation] = useState("Any")
  const [income, setIncome] = useState("All")

  // Scroll UI Logic (Fixed)
  const [isScrolling, setScrolling] = useState(false) // Tracks if user is down the page
  const [showFilters, setFilters] = useState(true)    // Tracks if menu should be visible

  // --- EFFECT 1: FETCH DATA ---
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const { data, error } = await supabase
          .from('Schemes') 
          .select('*');
        
        if (error) throw error;
        if (data) setSchemes(data);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // --- EFFECT 2: TRACK SCROLL POSITION ---
  useEffect(() => {
    const handleScroll = () => {
      // Just check position, don't change filter visibility here
      if (window.scrollY > 100) { 
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- EFFECT 3: REACT TO SCROLL CHANGES ---
  // This prevents the "Logic Loop" bug. 
  // We only auto-close when you scroll down, but we don't force-close if you click the button.
  useEffect(() => {
    if (isScrolling) {
      setFilters(false); // Collapse when scrolling down
    } else {
      setFilters(true);  // Expand when back at top
    }
  }, [isScrolling]);

  // --- FILTER LOGIC ---
  const resetFilters = () => {
    setAge(25);
    setGender("All");
    setCategory("All");
    setOccupation("Any");
    setIncome("All");
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const ageMatch = age >= scheme.min_age && age <= scheme.max_age;
      const genderMatch = gender === "All" || scheme.gender === "All" || scheme.gender === gender;
      const categoryMatch = category === "All" || (scheme.category && scheme.category.includes(category));
      const occupationMatch = occupation === "Any" || scheme.occupation === "Any" || (scheme.occupation && scheme.occupation.includes(occupation));
      const incomeMatch = income === "All" || scheme.income_threshold === "None" || scheme.income_threshold === income;
      
      return ageMatch && genderMatch && categoryMatch && occupationMatch && incomeMatch;
    });
  }, [schemes, age, gender, category, occupation, income]); 

  // --- RENDER ---
  return (
    <main className="min-h-screen bg-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/">
              <Button variant="ghost" className="mb-2 -ml-2 text-zinc-500 hover:text-black transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">Scheme Finder</h1>
            <p className="text-zinc-500 font-medium">Gov&Me Intelligence: Personalized Citizen Subsidies & Schemes</p>
          </div>
          <div className="bg-blue-400 text-white px-5 py-5 rounded-full text-sm font-bold shadow-lg">
            {isLoading ? "Loading..." : `${filteredSchemes.length} Matches Found`}
          </div>
        </div>

        {/* --- DYNAMIC FILTER SECTION --- */}
        <div className="sticky top-6 z-20">
            {(!isScrolling || showFilters) ? (
                // OPTION A: Full Filter Card
                <Card className="p-6 shadow-2xl border-none bg-white/90 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
                        
                        {/* Age */}
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Age</Label>
                            <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="h-12 border-zinc-200 focus:ring-zinc-900" />
                        </div>
                        
                        {/* Gender */}
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Gender</Label>
                            <Select onValueChange={setGender} value={gender}>
                                <SelectTrigger className="h-12 border-zinc-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STATIC_FILTERS.genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Category</Label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger className="h-12 border-zinc-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {STATIC_FILTERS.categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Occupation */}
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Occupation</Label>
                            <Select onValueChange={setOccupation} value={occupation}>
                                <SelectTrigger className="h-12 border-zinc-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STATIC_FILTERS.occupations.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Income */}
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">Income Group</Label>
                            <Select onValueChange={setIncome} value={income}>
                                <SelectTrigger className="h-12 border-zinc-200"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STATIC_FILTERS.income_thresholds.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Button */}
                        <div className="pb-0.5">
                            <Button onClick={resetFilters} variant="outline" className="w-full h-12 border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all font-bold text-xs uppercase tracking-tighter">
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                    
                    {/* Tiny 'Hide' button (Only shows if we are scrolled down but forced the menu open) */}
                    {isScrolling && (
                        <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
                             <Button onClick={() => setFilters(false)} variant="secondary" size="sm" className="h-6 text-[10px] rounded-full shadow-md border border-zinc-200">
                                Hide Filters
                             </Button>
                        </div>
                    )}
                </Card>
            ) : (
                // OPTION B: The "Adjust Filters" Button
                <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                    <Button 
                        onClick={() => setFilters(true)} 
                        className="rounded-full shadow-2xl bg-zinc-900 text-white px-6 py-6 text-sm font-bold border-4 border-slate-200 hover:scale-105 transition-transform"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Adjust Filters
                    </Button>
                </div>
            )}
        </div>

        {/* Schemes Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
             <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
                <p className="text-xl font-bold text-zinc-400 animate-pulse">Loading Schemes...</p>
             </div>
          ) : filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, i) => (
              <Card key={i} className="flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all border-zinc-200 group relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-3">
                   <button className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all">
                    <DigiLockerIcon size={18} />
                      Connect DigiLocker
                  </button>
                </div>
                <CardHeader className="pb-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    {scheme.type} • {scheme.category ? scheme.category.split(',')[0] : 'General'}
                  </span>
                  <CardTitle className="text-xl font-extrabold text-zinc-900 leading-tight">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grow space-y-5">
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium italic">
                    {scheme.description || "Official government support program."}
                  </p>
                  
                  <div className="p-4 bg-emerald-200 border border-emerald-100 text-emerald-900 rounded-2xl">
                    <p className="text-[9px] uppercase font-bold text-emerald-800 mb-1 tracking-widest">
                    Primary Benefit
                    </p>
                    <p className="text-sm font-bold leading-snug text-emerald-800">
                      {scheme.benefit}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-100 space-y-2">
                    <div className="flex items-start text-xs text-zinc-500 font-bold">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-zinc-900 shrink-0" />
                      Required Docs: {scheme.docs}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-4">
              <SearchX className="h-16 w-16 text-zinc-200" />
              <div className="text-center">
                <p className="text-xl font-bold text-zinc-900">No matching benefits found</p>
                <p className="text-zinc-500">Try adjusting your filters to broaden the search.</p>
              </div>
              <Button onClick={() => {setIncome("All"); setOccupation("Any"); setGender("All"); setCategory("All"); setAge(25);}} variant="outline" className="mt-4">
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}