"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight,
  Landmark,
  Info,
  Scale,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// --- Helper for Currency ---
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function TaxCalculationPage() {
  // --- STATE with DEFAULTS ---
  const [income, setIncome] = useState("1200000"); // Default 12L
  const [category, setCategory] = useState("Individual");
  const [isHighTurnover, setIsHighTurnover] = useState(false);
  const [tax, setTax] = useState<number | null>(null);

  // --- LOGIC PORTED TO FRONTEND (No API calls = No Crashes) ---
  const handleCalculate = () => {
    const val = parseFloat(income) || 0;
    let calculatedTax = 0;

    if (category === "Individual" || category === "HUF") {
      // New Regime FY 2025-26 Rules
      const standardDeduction = 75000;
      const taxable = Math.max(0, val - standardDeduction);

      // Rebate u/s 87A: Tax-free up to 12L
      if (taxable <= 1200000) {
        calculatedTax = 0;
      } else {
        // Slabs logic
        let remaining = taxable;
        remaining -= 400000; // 0-4L Nil
        
        if (remaining > 0) { // 4-8L 5%
          const slab = Math.min(remaining, 400000);
          calculatedTax += slab * 0.05;
          remaining -= slab;
        }
        if (remaining > 0) { // 8-12L 10%
          const slab = Math.min(remaining, 400000);
          calculatedTax += slab * 0.10;
          remaining -= slab;
        }
        if (remaining > 0) { // 12-16L 15%
          const slab = Math.min(remaining, 400000);
          calculatedTax += slab * 0.15;
          remaining -= slab;
        }
        if (remaining > 0) { // 16-20L 20%
          const slab = Math.min(remaining, 400000);
          calculatedTax += slab * 0.20;
          remaining -= slab;
        }
        if (remaining > 0) { // 20-24L 25%
          const slab = Math.min(remaining, 400000);
          calculatedTax += slab * 0.25;
          remaining -= slab;
        }
        if (remaining > 0) { // >24L 30%
          calculatedTax += remaining * 0.30;
        }
      }
    } 
    else if (category === "DomesticCompany") {
      const rate = isHighTurnover ? 0.30 : 0.25;
      calculatedTax = val * rate;
      if (val > 100000000) calculatedTax *= 1.12; 
      else if (val > 10000000) calculatedTax *= 1.07;
    } 
    else if (category === "ForeignCompany") {
      calculatedTax = val * 0.40;
      if (val > 100000000) calculatedTax *= 1.05;
      else if (val > 10000000) calculatedTax *= 1.02;
    } 
    else if (category === "Firms" || category === "LLP") {
      calculatedTax = val * 0.30;
      if (val > 10000000) calculatedTax *= 1.12;
    }
    else if (category === "CoOpSociety") {
        if (val <= 10000) calculatedTax = val * 0.10;
        else if (val <= 20000) calculatedTax = 1000 + (val - 10000) * 0.20;
        else calculatedTax = 3000 + (val - 20000) * 0.30;
        if (val > 10000000) calculatedTax *= 1.12;
    }

    // Cess (4%)
    if (calculatedTax > 0) calculatedTax *= 1.04;

    setTax(Math.round(calculatedTax));
  };

  // --- INFO DATA ---
  const summary = useMemo(() => {
    const details: Record<string, { title: string; rate: string; logic: string; note: string }> = {
      Individual: {
        title: "Individual / HUF (New Regime)",
        rate: "0% to 30% (Progressive)",
        logic: "Under the default New Tax Regime (AY 2026-27), income up to ₹4 Lakh is tax-free. Slabs then increase by 5% every ₹4 Lakh. A standard deduction of ₹75,000 applies to salaried individuals.",
        note: "Rebate u/s 87A makes income up to ₹12 Lakh effectively tax-free for residents."
      },
      HUF: {
        title: "Hindu Undivided Family",
        rate: "Slab Based",
        logic: "HUF units are taxed as separate entities using the same progressive slabs as individuals.",
        note: "Allows for tax planning by distributing income among family members."
      },
      DomesticCompany: {
        title: "Domestic Company",
        rate: isHighTurnover ? "30% (Base)" : "25% (Base)",
        logic: `Companies with a turnover up to ₹400 Cr in FY 2023-24 enjoy a reduced rate of 25%. Larger corporations are taxed at 30%.`,
        note: "Surcharge of 7% applies if income exceeds ₹1 Cr; 12% if above ₹10 Cr."
      },
      ForeignCompany: {
        title: "Foreign Company",
        rate: "40% (Flat)",
        logic: "Foreign entities are generally taxed at a flat rate of 40% on income earned within India.",
        note: "Surcharge is lower (2% to 5%) compared to domestic companies."
      },
      Firms: {
        title: "Partnership Firms",
        rate: "30% (Flat)",
        logic: "Partnership firms are taxed at a flat rate of 30% on total income.",
        note: "A 12% surcharge applies if total income exceeds ₹1 Crore."
      },
      LLP: {
        title: "Limited Liability Partnership",
        rate: "30% (Flat)",
        logic: "LLPs follow the same flat 30% taxation as traditional firms. AMT applies if tax < 18.5%.",
        note: "Effective April 2025, new 10% TDS rules apply to partner payments above ₹20,000."
      },
      CoOpSociety: {
        title: "Co-operative Society",
        rate: "10% to 30% (Graduated)",
        logic: "Income up to ₹10k (10%), ₹10k-₹20k (20%), and >₹20k (30%).",
        note: "Manufacturing co-operatives registered after April 2023 can opt for a lower 15% rate."
      }
    };
    return details[category] || details.Individual;
  }, [category, isHighTurnover]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 flex flex-col">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        {/* Navigation */}
        <div>
          <Link href="/">
            <div className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              <span className="text-sm font-medium">Back to Home</span>
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-2 px-1">
          <div className="p-3 bg-slate-900 rounded-xl shadow-lg">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tax Engine</h1>
            <p className="text-sm text-slate-500">Universal Duty Calculator (FY 2025-26)</p>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Inputs */}
          <Card className="border-t-4 border-t-slate-900 shadow-md">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-base flex items-center text-slate-700">
                <Calculator className="w-5 h-5 mr-2 text-slate-500" />
                Parameters
              </CardTitle>
            </CardHeader>
            <div className="p-6 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-slate-600">Taxpayer Category</Label>
                <Select onValueChange={setCategory} defaultValue={category}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual / Salary</SelectItem>
                    <SelectItem value="HUF">Hindu Undivided Family</SelectItem>
                    <SelectItem value="DomesticCompany">Domestic Company</SelectItem>
                    <SelectItem value="ForeignCompany">Foreign Company</SelectItem>
                    <SelectItem value="Firms">Partnership Firm</SelectItem>
                    <SelectItem value="LLP">LLP</SelectItem>
                    <SelectItem value="CoOpSociety">Co-operative Society</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {category === "DomesticCompany" && (
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-amber-900">High Turnover?</Label>
                    <p className="text-xs text-amber-700">Is turnover {'>'} ₹400 Cr?</p>
                  </div>
                  <Switch checked={isHighTurnover} onCheckedChange={setIsHighTurnover} />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-slate-600">Annual Taxable Income (INR)</Label>
                <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">₹</span>
                    <Input 
                        type="number" 
                        value={income} 
                        onChange={(e) => setIncome(e.target.value)} 
                        className="pl-7 h-11 text-lg font-medium" 
                    />
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full h-12 bg-slate-900 text-white rounded-md font-medium text-base hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg shadow-slate-900/20 active:scale-[0.98]"
              >
                Analyze Duty
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </Card>

          {/* RIGHT: Result */}
          <Card className="bg-slate-900 text-white shadow-xl border-none flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                  {summary.rate}
                </Badge>
              </div>
              
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Estimated Tax</p>
              <h2 className="text-6xl font-black mt-4 tracking-tighter text-white">
                {tax !== null ? formatCurrency(tax) : "—"}
              </h2>
              {tax !== null && (
                 <p className="text-slate-400 text-sm mt-2">Includes Health & Education Cess (4%)</p>
              )}
            </div>

            <div className="p-8 bg-white/5 border-t border-white/10 relative z-10">
               <div className="flex gap-3">
                 <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />
                 <p className="text-slate-300 text-sm italic leading-relaxed">
                   "Fiscal duty fuels the nation. Ensure you have accounted for all deductions before finalizing this number."
                 </p>
               </div>
            </div>
          </Card>
        </div>

        {/* BOTTOM: Summary Info (VISUAL BUG FIXED HERE) */}
        <Card className="border-none shadow-lg bg-white overflow-hidden">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-500" />
            <span className="font-bold text-slate-700 uppercase tracking-tight text-sm">
              {/* THE FIX: Using summary.title instead of raw category ID */}
              Category Analysis: {summary.title}
            </span>
          </div>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Scale className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Tax Structure</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">{summary.rate}</p>
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Landmark className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Fiscal Logic</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {summary.logic}
                  </p>
                </div>
                
                <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 flex gap-4 items-start">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-emerald-800 uppercase mb-1">Expert Note</span>
                    <p className="text-sm text-emerald-900 font-medium">{summary.note}</p>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}