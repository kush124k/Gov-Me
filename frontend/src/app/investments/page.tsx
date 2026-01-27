"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Info,
  BadgeIndianRupee,
  PieChart,
  AlertTriangle,
  ArrowLeft
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Custom Tooltip ---
const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex items-center ml-1.5 align-middle">
    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-100 transition-all duration-200 pointer-events-none text-center leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  </div>
);

// --- Styles ---
const INPUT_STYLES = "flex h-10 w-full rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const LABEL_STYLES = "text-xs font-medium text-slate-600 flex items-center mb-1.5";

type TaxResult = {
  gain: number;
  tax: number;
  type: string;
  is_slab: boolean;
  holding_months: number;
};

export default function InvestmentPage() {
  // --- STATE WITH DEFAULTS ---
  const [formData, setFormData] = useState({
    asset_type: "Equity",
    purchase_price: "100000",    // Default: ₹1 Lakh
    sale_price: "300000",        // Default: ₹3 Lakhs
    purchase_date: "2023-01-01", // Default: 2 Years ago (LTCG)
    sale_date: "2025-01-01"      // Default: Today
  });
  const [result, setResult] = useState<TaxResult | null>(null);

  // --- THE LOGIC (Ported from Python) ---
  const handleCalculate = () => {
    // 1. Parse Inputs
    const buyPrice = parseFloat(formData.purchase_price) || 0;
    const sellPrice = parseFloat(formData.sale_price) || 0;
    const buyDate = new Date(formData.purchase_date);
    const sellDate = new Date(formData.sale_date);

    // 2. Basic Validation
    if (!formData.purchase_date || !formData.sale_date) {
      alert("Please select both purchase and sale dates.");
      return;
    }

    // 3. Calculate Gain & Holding Period
    const gain = sellPrice - buyPrice;
    
    // Calculate difference in months (approx)
    const diffTime = Math.abs(sellDate.getTime() - buyDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const holdingMonths = diffDays / 30.44;

    let tax = 0;
    let type = "";
    let is_slab = false;

    // 4. Apply Tax Rules (FY 2025-26)
    if (gain <= 0) {
       type = "Capital Loss";
       tax = 0;
    } else if (formData.asset_type === "Equity") {
        if (holdingMonths > 12) {
            type = "LTCG (Section 112A)";
            // 1.25 Lakh Exemption
            const taxableGain = Math.max(0, gain - 125000);
            tax = taxableGain * 0.125; // 12.5%
        } else {
            type = "STCG (Section 111A)";
            tax = gain * 0.20; // 20%
        }
    } else {
        // Real Estate & Gold
        if (holdingMonths > 24) {
            type = "LTCG (Section 112)";
            // 12.5% Flat (No Indexation)
            tax = gain * 0.125;
        } else {
            type = "STCG (Slab Rate)";
            is_slab = true; // Added to income
            tax = 0; 
        }
    }

    setResult({
        gain,
        tax,
        type,
        is_slab,
        holding_months: parseFloat(holdingMonths.toFixed(1))
    });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        

        {/* Header */}
        <div className="flex items-center space-x-3 mb-2 px-1">
          <div className="p-2.5 bg-slate-900 rounded-xl shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Capital Gains</h1>
            <p className="text-sm text-slate-500">Investment Tax Analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-4">
            <Card className="border-t-4 border-t-slate-900 shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                <CardTitle className="text-base flex items-center text-slate-700">
                  <PieChart className="w-5 h-5 mr-2 text-slate-500" />
                  Asset Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-5 space-y-5">
                  
                  {/* Row 1: Asset Type */}
                  <div>
                    <label className={LABEL_STYLES}>
                      Asset Class <InfoTooltip text="Different assets have different holding periods for LTCG." />
                    </label>
                    <Select 
                      onValueChange={(v) => setFormData({...formData, asset_type: v})} 
                      defaultValue="Equity"
                    >
                      <SelectTrigger className="h-10 w-full border-slate-300 focus:ring-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equity">Equity / Mutual Funds</SelectItem>
                        <SelectItem value="RealEstate">Real Estate (Property)</SelectItem>
                        <SelectItem value="Gold">Gold / Bonds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Row 2: Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_STYLES}>
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Purchase Date
                      </label>
                      <input 
                        type="date" 
                        value={formData.purchase_date}
                        className={INPUT_STYLES}
                        onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className={LABEL_STYLES}>
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Sale Date
                      </label>
                      <input 
                        type="date" 
                        value={formData.sale_date}
                        className={INPUT_STYLES}
                        onChange={(e) => setFormData({...formData, sale_date: e.target.value})} 
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Row 3: Financials */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL_STYLES}>
                        Buy Price <InfoTooltip text="Total cost of acquisition." />
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                        <input 
                          type="number" 
                          value={formData.purchase_price}
                          className={`${INPUT_STYLES} pl-7`}
                          placeholder="0"
                          onChange={(e) => setFormData({...formData, purchase_price: e.target.value})} 
                        />
                      </div>
                    </div>
                    <div>
                      <label className={LABEL_STYLES}>
                        Sell Price <InfoTooltip text="Total sale value." />
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                        <input 
                          type="number" 
                          value={formData.sale_price}
                          className={`${INPUT_STYLES} pl-7`}
                          placeholder="0"
                          onChange={(e) => setFormData({...formData, sale_price: e.target.value})} 
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCalculate} 
                    className="w-full h-11 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg shadow-slate-900/20 cursor-pointer active:scale-[0.98]"
                  >
                    Analyze Profit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          <div className="lg:col-span-8">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Result Hero Card */}
                <Card className={`border-l-4 shadow-lg overflow-hidden ${result.gain >= 0 ? "border-l-emerald-500" : "border-l-red-500"}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-3 mb-2">
                           <Badge variant="outline" className="px-3 py-1 border-slate-200 text-slate-700 bg-slate-50">
                             {result.type} • {result.holding_months} months
                           </Badge>
                         </div>
                         
                         {result.is_slab ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-amber-500">Slab Rate</span>
                                <span className="text-slate-500 font-medium">tax applies</span>
                            </div>
                         ) : (
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold text-slate-900">
                                    {formatCurrency(result.tax)}
                                </span>
                                <span className="text-slate-500 font-medium">tax liability</span>
                            </div>
                         )}

                         <p className="text-slate-600 text-sm max-w-md pt-2">
                           {result.gain > 0 
                             ? `You made a profit of ${formatCurrency(result.gain)}. This falls under ${result.type} based on a holding period of ${result.holding_months} months.` 
                             : "You have incurred a capital loss. No tax is payable on this transaction."}
                         </p>
                      </div>

                      {/* Profit/Loss Badge */}
                      <div className={`flex flex-col items-center justify-center h-32 w-48 rounded-lg border ${result.gain >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                          <span className={`text-xs font-bold uppercase tracking-wider ${result.gain >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            Net {result.gain >= 0 ? "Profit" : "Loss"}
                          </span>
                          <span className={`text-2xl font-bold mt-1 ${result.gain >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                            {formatCurrency(result.gain)}
                          </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tax Logic Info */}
                <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4 flex gap-4 items-start">
                        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-slate-900 text-sm">Tax Rule Applied</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {formData.asset_type === "Equity" && "LTCG on Equity (held >12 months) has a ₹1.25L exemption. Taxed at 12.5% thereafter. STCG is taxed at 20%."}
                                {formData.asset_type === "RealEstate" && "Real Estate held >24 months: LTCG is 12.5% without indexation. STCG is taxed at your income slab rate."}
                                {formData.asset_type === "Gold" && "Gold held >24 months: LTCG is 12.5%. STCG is added to your income and taxed at slab rates."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

              </div>
            ) : (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center min-h-100">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <BadgeIndianRupee className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Investment Tax Analyzer</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Enter your purchase and sale details to instantly calculate Capital Gains Tax based on the latest FY 2025-26 rules.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}