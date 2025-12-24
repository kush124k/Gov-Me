"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Calculator, 
  TrendingUp, 
  Building2, 
  Wallet, 
  ArrowRight,
  Save
} from "lucide-react";

// --- Types based on your backend models ---
type FormData = {
  gross_salary: number;
  other_deductions_80c: number;
  health_insurance: number;
  nps_voluntary: number;
  // Simplified inputs for the UI that we map to backend lists
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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
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
    
    // Transform UI data to match your Backend "FinancialDiaryRequest" structure
    const payload = {
      gross_salary: Number(data.gross_salary),
      other_deductions_80c: Number(data.other_deductions_80c),
      health_insurance: Number(data.health_insurance),
      nps_voluntary: Number(data.nps_voluntary),
      // MAPPING: Convert simple profit inputs to InvestmentEntry list
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
      // MAPPING: Convert rental input to PropertyEntry list
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

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-lg shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Diary</h1>
            <p className="text-slate-500">Plan your taxes for FY 2025-26</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUT FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-lg flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-indigo-600" />
                  Income & Investments
                </h2>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                
                {/* Salary Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Gross Salary (Annual)</label>
                  <input 
                    {...register("gross_salary")}
                    type="number" 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Deductions Section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Deductions (Old Regime)</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">80C (Max 1.5L)</label>
                      <input 
                        {...register("other_deductions_80c")}
                        type="number" 
                        className="flex h-9 w-full rounded-md border border-slate-300 px-3 py-1 text-sm focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Health Ins. (80D)</label>
                      <input 
                        {...register("health_insurance")}
                        type="number" 
                        className="flex h-9 w-full rounded-md border border-slate-300 px-3 py-1 text-sm focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Capital Gains / Other Income */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" /> Capital Gains & Rent
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-600">LTCG Profit (Stocks)</label>
                      <input {...register("equity_ltcg_profit")} type="number" className="w-32 h-8 text-right border rounded px-2 text-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-600">STCG Profit (Stocks)</label>
                      <input {...register("equity_stcg_profit")} type="number" className="w-32 h-8 text-right border rounded px-2 text-sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-600">Rental Income</label>
                      <input {...register("rental_income")} type="number" className="w-32 h-8 text-right border rounded px-2 text-sm" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                >
                  {loading ? "Calculating..." : "Analyze Tax"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: VISUALIZATION */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-500 mb-1">Recommended Regime</div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {result.summary.best_regime} Regime
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                      <Save className="w-3 h-3 mr-1" />
                      Save ₹{result.summary.savings.toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="text-sm text-slate-500 mb-1">Effective Tax Rate</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {((result.details[result.summary.best_regime.toLowerCase()].total_tax / Number(watch("gross_salary"))) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Based on Gross Salary
                    </div>
                  </div>
                </div>

                {/* Main Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
                  <h3 className="font-semibold text-slate-900 mb-6">Tax Comparison Breakdown</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                      data={result.comparison_chart}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="label" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        tickFormatter={(value: number) => `₹${value/1000}k`}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" />
                      <Bar 
                        dataKey="Old Regime" 
                        fill="#6366f1" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                      />
                      <Bar 
                        dataKey="New Regime" 
                        fill="#0ea5e9" 
                        radius={[4, 4, 0, 0]} 
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-lg">
                  <h4 className="font-medium text-slate-400 mb-4 uppercase text-xs tracking-wider">Tax Calculation Details</h4>
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <div className="text-indigo-400 font-semibold mb-2">Old Regime</div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Slab Tax</span>
                        <span>₹{result.details.old.components.slab_tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Inv. Tax</span>
                        <span>₹{result.details.old.components.investment_tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold text-white mt-1">
                        <span>Total</span>
                        <span>₹{result.details.old.total_tax.toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sky-400 font-semibold mb-2">New Regime</div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Slab Tax</span>
                        <span>₹{result.details.new.components.slab_tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span>Inv. Tax</span>
                        <span>₹{result.details.new.components.investment_tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold text-white mt-1">
                        <span>Total</span>
                        <span>₹{result.details.new.total_tax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Ready to Analyze</h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Enter your salary and investment details on the left to generate your personalized tax report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
