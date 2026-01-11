"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { 
  Calculator, 
  TrendingUp, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Info,
  Scale,
  CheckCircle2,
  XCircle,
  PiggyBank,
  Briefcase
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// --- Types ---
type FormData = {
  gross_salary: number;
  other_deductions_80c: number;
  health_insurance: number;
  nps_voluntary: number;
  equity_ltcg_profit: number;
  equity_stcg_profit: number;
  rental_income: number;
};

type TaxResult = {
  summary: {
    best_regime: string;
    savings: number;
  };
  comparison_chart: Array<{
    label: string;
    "Old Regime": number;
    "New Regime": number;
  }>;
  details: any;
};

export default function TaxPlanner() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      gross_salary: 1200000,
      other_deductions_80c: 150000,
      health_insurance: 25000,
      nps_voluntary: 0,
      equity_ltcg_profit: 0,
      equity_stcg_profit: 0,
      rental_income: 0,
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    // Transform UI data to Backend payload
    const payload = {
      gross_salary: Number(data.gross_salary),
      other_deductions_80c: Number(data.other_deductions_80c),
      health_insurance: Number(data.health_insurance),
      nps_voluntary: Number(data.nps_voluntary),
      investments: [
        {
          asset_name: "Equity Portfolio (LTCG)",
          buy_price: 0,
          sell_price: Number(data.equity_ltcg_profit),
          asset_type: "equity",
          is_long_term: true
        },
        {
          asset_name: "Equity Portfolio (STCG)",
          buy_price: 0,
          sell_price: Number(data.equity_stcg_profit),
          asset_type: "equity",
          is_long_term: false
        }
      ],
      properties: data.rental_income > 0 ? [{
        property_name: "Rented House",
        rental_income: Number(data.rental_income),
        municipal_taxes: 0,
        loan_interest: 0,
        is_self_occupied: false
      }] : []
    };

    try {
       const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${backendUrl}/analyze-diary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper for formatting currency
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Derived state for UI styling & Analysis
  const isOldBetter = result?.summary.best_regime === "Old";
  const grossSalary = Number(watch("gross_salary"));
  
  // Calculate total deductions entered by user (for the Strategy Tab)
  const totalDeductions = Number(watch("other_deductions_80c")) + Number(watch("health_insurance")) + Number(watch("nps_voluntary")) + 50000; // Adding std deduction
  const tippingPoint = 375000;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-slate-900 rounded-xl shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Diary</h1>
            <p className="text-slate-500">Interactive Tax Planning & Strategy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUT FORM */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-t-4 border-t-slate-900 shadow-md">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg flex items-center text-slate-700">
                  <Wallet className="w-5 h-5 mr-2 text-slate-500" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  
                  {/* Salary Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">Gross Annual Salary</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                      <input 
                        {...register("gross_salary")}
                        type="number" 
                        className="flex h-10 w-full rounded-md border border-slate-300 pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Deductions Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Old Regime Shields
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">80C (Max 1.5L)</label>
                        <input 
                          {...register("other_deductions_80c")}
                          type="number" 
                          className="flex h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-600">Health Ins. (80D)</label>
                        <input 
                          {...register("health_insurance")}
                          type="number" 
                          className="flex h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-medium text-slate-600">NPS (Voluntary)</label>
                        <input 
                          {...register("nps_voluntary")}
                          type="number" 
                          className="flex h-9 w-full rounded-md border border-slate-300 px-3 text-sm focus:ring-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Other Income */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> Wealth & Gains
                    </h3>
                    
                    <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-600">LTCG (Stocks)</label>
                        <input {...register("equity_ltcg_profit")} type="number" className="w-24 h-8 text-right border rounded px-2 text-sm focus:ring-indigo-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-600">STCG (Stocks)</label>
                        <input {...register("equity_stcg_profit")} type="number" className="w-24 h-8 text-right border rounded px-2 text-sm focus:ring-indigo-500" />
                      </div>
                      <div className="flex items-center justify-between">
                         <label className="text-xs text-slate-600">Rental Income</label>
                         <input {...register("rental_income")} type="number" className="w-24 h-8 text-right border rounded px-2 text-sm focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-11 bg-slate-900 text-white rounded-md font-medium text-sm hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg shadow-slate-900/20"
                  >
                    {loading ? "Crunching Numbers..." : "Run Analysis"}
                    {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: VISUALIZATION */}
          <div className="lg:col-span-8 space-y-6">
            {result ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. HERO RESULT CARD */}
                <Card className={`border-l-4 shadow-lg overflow-hidden ${isOldBetter ? "border-l-emerald-500" : "border-l-indigo-500"}`}>
                  <div className={`h-1 w-full ${isOldBetter ? "bg-emerald-500/20" : "bg-indigo-500/20"}`} />
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-3 mb-2">
                           <Badge variant="outline" className={`px-3 py-1 ${isOldBetter ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-indigo-200 text-indigo-700 bg-indigo-50"}`}>
                             Recommend: {result.summary.best_regime} Regime
                           </Badge>
                         </div>
                         
                         <div className="flex items-baseline gap-2">
                           <span className={`text-5xl font-extrabold ${isOldBetter ? "text-emerald-600" : "text-indigo-600"}`}>
                             {formatCurrency(result.summary.savings)}
                           </span>
                           <span className="text-slate-500 font-medium">projected savings</span>
                         </div>
                         
                         <p className="text-slate-600 text-sm max-w-md pt-2">
                           {isOldBetter 
                             ? "Your deductions successfully beat the New Regime's lower rates. Stick to the Old Regime to maximize wealth." 
                             : "The New Regime wins. You would need significantly more deductions to make the Old Regime viable."}
                         </p>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-32 w-full md:w-48 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={result.comparison_chart}>
                            <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                            <Bar dataKey="Old Regime" fill="#10b981" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="New Regime" fill="#6366f1" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. DEEP DIVE TABS */}
                <Tabs defaultValue="strategy" className="w-full">
                  <TabsList className="grid w-full md:w-150 grid-cols-3 mb-6 bg-slate-100 p-1">
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    <TabsTrigger value="shield">Tax Shield</TabsTrigger>
                    <TabsTrigger value="breakdown">Detailed Table</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: STRATEGY (The "Why") */}
                  <TabsContent value="strategy" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* The Tipping Point Logic */}
                        <Card className="bg-orange-50/50 border-orange-100">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-orange-800 flex items-center">
                                    <Scale className="w-4 h-4 mr-2" /> The "Tipping Point" Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-slate-600">
                                    To beat the New Regime at your income level, you generally need total deductions of <span className="font-bold">₹3.75 Lakhs</span>.
                                </p>
                                <div className="bg-white p-4 rounded-lg border border-orange-100 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Your Total Deductions</span>
                                        <span className={`font-bold ${totalDeductions > tippingPoint ? "text-emerald-600" : "text-slate-900"}`}>
                                            {formatCurrency(totalDeductions)}
                                        </span>
                                    </div>
                                    <Progress value={(totalDeductions / tippingPoint) * 100} className="h-2" indicatorClassName={totalDeductions > tippingPoint ? "bg-emerald-500" : "bg-indigo-500"} />
                                    <div className="text-xs text-slate-400 text-right">Target: {formatCurrency(tippingPoint)}</div>
                                </div>
                                <div className="pt-2">
                                    {totalDeductions > tippingPoint ? (
                                        <div className="flex items-center text-xs text-emerald-700 bg-emerald-100 p-2 rounded">
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> You crossed the threshold! Old Regime is safer.
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-xs text-indigo-700 bg-indigo-100 p-2 rounded">
                                            <Info className="w-4 h-4 mr-2" /> You are below the threshold. New Regime is better.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Effective Tax Rate */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-slate-700">Effective Tax Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-slate-600">
                                        <span>Old Regime</span>
                                        <span className="font-bold">{((result.details.old.total_tax / grossSalary) * 100).toFixed(1)}%</span>
                                    </div>
                                    <Progress value={((result.details.old.total_tax / grossSalary) * 100) * 3} className="h-2" indicatorClassName="bg-emerald-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 text-slate-600">
                                        <span>New Regime</span>
                                        <span className="font-bold">{((result.details.new.total_tax / grossSalary) * 100).toFixed(1)}%</span>
                                    </div>
                                    <Progress value={((result.details.new.total_tax / grossSalary) * 100) * 3} className="h-2" indicatorClassName="bg-indigo-500" />
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    *Percentage of your Gross Salary that goes to tax.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                  </TabsContent>

                  {/* TAB 2: TAX SHIELD (Visualizing Deductions) */}
                  <TabsContent value="shield">
                    <Card className="border-t-4 border-t-emerald-500">
                        <CardHeader>
                            <CardTitle className="text-emerald-800 flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-2" /> Your Tax Shield
                            </CardTitle>
                            <CardDescription>
                                Breakout of deductions protecting your income in the Old Regime
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                             {/* Standard Deduction */}
                             <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><Briefcase className="w-4 h-4"/></div>
                                    <span className="text-sm font-medium text-slate-700">Standard Deduction</span>
                                </div>
                                <span className="font-bold text-slate-900">₹50,000</span>
                             </div>
                             
                             {/* 80C */}
                             <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><PiggyBank className="w-4 h-4"/></div>
                                    <span className="text-sm font-medium text-slate-700">Section 80C</span>
                                </div>
                                <span className="font-bold text-slate-900">{formatCurrency(Number(watch("other_deductions_80c")))}</span>
                             </div>

                             {/* 80D */}
                             <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600"><ShieldCheck className="w-4 h-4"/></div>
                                    <span className="text-sm font-medium text-slate-700">Health Insurance (80D)</span>
                                </div>
                                <span className="font-bold text-slate-900">{formatCurrency(Number(watch("health_insurance")))}</span>
                             </div>

                             <Separator className="my-2"/>
                             
                             <div className="flex justify-between items-center px-2">
                                <span className="text-sm text-slate-500">Total Taxable Income Reduced By</span>
                                <span className="text-xl font-bold text-emerald-600">{formatCurrency(totalDeductions)}</span>
                             </div>
                        </CardContent>
                    </Card>
                  </TabsContent>

                  {/* TAB 3: DETAILED TABLE */}
                  <TabsContent value="breakdown">
                    <Card>
                      <CardContent className="p-0 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 font-medium">Component</th>
                              <th className="px-6 py-4 font-medium text-right text-emerald-700">Old Regime</th>
                              <th className="px-6 py-4 font-medium text-right text-indigo-700">New Regime</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="px-6 py-4 font-medium text-slate-900">Tax on Salary</td>
                              <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(result.details.old.components.slab_tax)}</td>
                              <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(result.details.new.components.slab_tax)}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 font-medium text-slate-900">Tax on Investments</td>
                              <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(result.details.old.components.investment_tax)}</td>
                              <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(result.details.new.components.investment_tax)}</td>
                            </tr>
                            <tr className="bg-slate-50/50">
                              <td className="px-6 py-4 font-bold text-slate-900">Total Tax Liability</td>
                              <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatCurrency(result.details.old.total_tax)}</td>
                              <td className="px-6 py-4 text-right font-bold text-indigo-600">{formatCurrency(result.details.new.total_tax)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              // EMPTY STATE
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Calculator className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Ready to Crunch Numbers</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Enter your salary and investment details on the left. We'll run the simulation against both tax regimes instantly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
