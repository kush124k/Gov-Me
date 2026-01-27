'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js'; 
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, SearchX, Filter, ChevronDown } from 'lucide-react';
import { DigiLockerIcon } from '@/components/ui/DigiLockerIcon';

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STATIC_FILTERS = {
    target_groups: ["All", "Student", "Farmer", "Minority", "Women", "Disabled", "Ex-Servicemen", "General"], 
    categories: ["All", "Cash transfer", "Education subsidy", "Financial Inclusion", "Insurance", "Pension", "Savings", "Skill Development", "Subsidy", "Tax Benefit"],
    genders: ["All", "Male", "Female", "Transgender"],
    occupations: ["Any", "Household", "Informal sector", "Landholding farmer", "Pensioner", "Salaried", "Self-employed", "Senior citizen", "Student", "Unemployed", "Unorganised worker"],
    income_thresholds: ["All", "BPL", "Upto ₹2,00,000", "Upto ₹3,00,000"]
};

export default function SchemesPage() {
  // --- STATE ---
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [age, setAge] = useState<number | ''>(''); 
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const [occupation, setOccupation] = useState("Any");
  const [income, setIncome] = useState("All");
  const [targetGroup, setTargetGroup] = useState("All");

  // Scroll UI Logic
  const [isScrolling, setScrolling] = useState(false);
  const [showFilters, setFilters] = useState(true);

  // --- EFFECT: FETCH DATA ---
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const { data, error } = await supabase.from('Schemes').select('*');
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

  // --- EFFECT: SCROLL ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setScrolling(true);
      else setScrolling(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolling) setFilters(false);
    else setFilters(true);
  }, [isScrolling]);

  // --- FILTER LOGIC ---
  const resetFilters = () => {
    setAge('');
    setGender("All");
    setCategory("All");
    setOccupation("Any");
    setIncome("All");
    setTargetGroup("All");
  };

  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const userAge = age === '' ? 25 : Number(age); 
      const ageMatch = age === '' || (userAge >= scheme.min_age && userAge <= scheme.max_age);
      const genderMatch = gender === "All" || scheme.gender === "All" || scheme.gender === gender;
      const categoryMatch = category === "All" || (scheme.category && scheme.category.includes(category));
      const occupationMatch = occupation === "Any" || scheme.occupation === "Any" || (scheme.occupation && scheme.occupation.includes(occupation));
      const incomeMatch = income === "All" || scheme.income_threshold === "None" || scheme.income_threshold === income;
      const targetMatch = targetGroup === "All" || (scheme.target_group && scheme.target_group.includes(targetGroup));

      return ageMatch && genderMatch && categoryMatch && occupationMatch && incomeMatch && targetMatch;
    });
  }, [schemes, age, gender, category, occupation, income, targetGroup]); 

  // --- RENDER ---
  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-blue-900 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-12">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-900">
            <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                  Scheme <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-600">Finder</span>
                </h1>
                <p className="text-zinc-400 font-medium mt-2 max-w-xl">
                  Gov&Me Intelligence: Personalized discovery of citizen subsidies, rights, and entitlements.
                </p>
            </div>
          
          
          <div className="flex flex-col items-end gap-2">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Database Status</span>
             <div className="bg-zinc-900 border border-zinc-800 text-blue-400 px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.1)] flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
               {isLoading ? "Syncing..." : `${filteredSchemes.length} Active Schemes`}
             </div>
          </div>
        </div>

{/* --- DYNAMIC FILTER BAR --- */}
        <div className="sticky top-4 z-30">
            {(!isScrolling || showFilters) ? (
                <Card className="p-4 shadow-2xl border-zinc-800 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {/* GRID LOGIC: 
                       - 'w-full': Forces grid to span the whole region.
                       - 'grid-cols-2': Mobile (2 per row)
                       - 'lg:grid-cols-3': Laptops (3 per row, 2 rows total). WIDE boxes for long words.
                       - 'xl:grid-cols-6': Large Screens (6 per row, 1 row total). Fits perfectly.
                    */}
                    <div className="grid grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4 w-full">
                        
                        {/* 1. Age */}
                        <div className="space-y-2 w-full">
                            <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Age</Label>
                            <Input 
                                type="number" 
                                placeholder="ex. 25"
                                value={age} 
                                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} 
                                className="h-10 w-full bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-blue-500/20" 
                            />
                        </div>
                        
                        {/* 2. Gender */}
                        <div className="space-y-2 w-full">
                           <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Gender</Label>
                           <FilterSelect value={gender} onChange={setGender} options={STATIC_FILTERS.genders} />
                        </div>

                        {/* 3. Category */}
                        <div className="space-y-2 w-full">
                           <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Category</Label>
                           <FilterSelect value={category} onChange={setCategory} options={STATIC_FILTERS.categories} />
                        </div>

                        {/* 4. Occupation */}
                        <div className="space-y-2 w-full">
                           <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Occupation</Label>
                           <FilterSelect value={occupation} onChange={setOccupation} options={STATIC_FILTERS.occupations} />
                        </div>

                        {/* 5. Income Group */}
                        <div className="space-y-2 w-full">
                           <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Income</Label>
                           <FilterSelect value={income} onChange={setIncome} options={STATIC_FILTERS.income_thresholds} />
                        </div>

                        {/* 6. Reset Button */}
                        <div className="flex flex-col justify-end w-full">
                            <Button 
                                onClick={resetFilters} 
                                variant="destructive" 
                                className="h-10 w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 font-bold truncate"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                    
                    {/* Collapse Handle */}
                    {isScrolling && (
                        <div onClick={() => setFilters(false)} className="absolute -bottom-6 left-1/2 -translate-x-1/2 cursor-pointer bg-zinc-900 border border-t-0 border-zinc-800 rounded-b-xl px-4 py-1 text-zinc-500 hover:text-white transition-colors">
                             <ChevronDown className="w-4 h-4 rotate-180" />
                        </div>
                    )}
                </Card>
            ) : (
                <div className="flex justify-center animate-in fade-in zoom-in duration-300">
                    <Button 
                        onClick={() => setFilters(true)} 
                        className="rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] bg-blue-600 text-white px-8 py-6 text-sm font-bold border border-blue-400 hover:scale-105 transition-transform"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Refine Search
                    </Button>
                </div>
            )}
        </div>
        {/* --- RESULTS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {isLoading ? (
             [1,2,3].map(i => (
                <div key={i} className="h-64 rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse"></div>
             ))
          ) : filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, i) => (
              <Card key={i} className="flex flex-col h-full bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all hover:bg-zinc-800/80 group relative overflow-hidden">
                
                <div className="absolute top-4 right-4 z-10">
                   <button className="flex items-center gap-1.5 bg-zinc-950/50 backdrop-blur-md border border-zinc-700 text-zinc-400 hover:text-white hover:border-blue-500/50 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all">
                    <DigiLockerIcon size={14} />
                      Verify
                  </button>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex gap-2 mb-3">
                     <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900/20 text-blue-400 border border-blue-900/30">
                        {scheme.type}
                     </span>
                     <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {scheme.category ? scheme.category.split(',')[0] : 'General'}
                     </span>
                  </div>
                  
                  {scheme.url ? (
                    <Link href={scheme.url} target="_blank" className="group-hover:text-blue-400 transition-colors">
                      <CardTitle className="text-xl font-bold text-zinc-100 leading-tight">
                        {scheme.name}
                      </CardTitle>
                    </Link>
                  ) : (
                    <CardTitle className="text-xl font-bold text-zinc-100 leading-tight">
                        {scheme.name}
                    </CardTitle>
                  )}
                </CardHeader>

                {/* Added 'pb-6' here to give space at the bottom since Footer is gone */}
                <CardContent className="grow space-y-5 pb-6">
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {scheme.description || "Official government support program."}
                  </p>
                  
                  <div className="p-4 bg-emerald-400/15 border border-zinc-800 rounded-xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 to-indigo-600"></div>
                    <p className="text-[12px] uppercase font-bold text-zinc-500 mb-1 tracking-widest">
                       Entitlement
                    </p>
                    <p className="text-sm font-bold leading-snug text-zinc-200">
                      {scheme.benefit}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start text-xs text-zinc-500">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500/50 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">Required: {scheme.docs}</span>
                    </div>
                  </div>
                </CardContent>
                
                {/* Footer Removed */}
              </Card>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="bg-zinc-900 p-6 rounded-full border border-zinc-800">
                  <SearchX className="h-12 w-12 text-zinc-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-200">No matching schemes found</p>
                <p className="text-zinc-500 mt-2 max-w-sm mx-auto">Try setting "Income" or "Occupation" to 'All' to see broader results.</p>
              </div>
              <Button onClick={resetFilters} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// --- HELPER COMPONENT ---
function FilterSelect({ value, onChange, options }: any) {
    return (
        <Select onValueChange={onChange} value={value}>
            {/* w-full makes it fill the static grid box. truncate handles long text safely. */}
            <SelectTrigger className="h-10 w-full bg-zinc-900 border-zinc-800 focus:ring-blue-500/20 text-white truncate">
                <SelectValue className="truncate" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 max-h-75">
                {options.map((o: string) => (
                    <SelectItem key={o} value={o} className="focus:bg-zinc-800 focus:text-white cursor-pointer">
                        {o}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

}