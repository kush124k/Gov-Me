'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Calendar, AlertCircle, IndianRupee } from "lucide-react"

export default function InvestmentPage() {
  const [formData, setFormData] = useState({
    asset_type: "Equity",
    purchase_price: "",
    sale_price: "",
    purchase_date: "",
    sale_date: ""
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/services/investment_tax`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            purchase_price: parseFloat(formData.purchase_price),
            sale_price: parseFloat(formData.sale_price)
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert("Backend Connection Error: Ensure FastAPI is running on port 8000");
    } finally {
        setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
        
        {/* Input Card */}
        <Card className="p-8 shadow-2xl border-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-600" /> Investment Analysis
            </CardTitle>
          </CardHeader>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Asset Class</Label>
              <Select onValueChange={(v) => setFormData({...formData, asset_type: v})} defaultValue="Equity">
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equity">Equity / Mutual Funds</SelectItem>
                  <SelectItem value="RealEstate">Real Estate (Property)</SelectItem>
                  <SelectItem value="Gold">Gold / Bonds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs uppercase font-bold text-zinc-500">
                  <Calendar className="w-3 h-3" /> Purchase Date
                </Label>
                <Input type="date" className="h-12" onChange={(e) => setFormData({...formData, purchase_date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1 text-xs uppercase font-bold text-zinc-500">
                  <Calendar className="w-3 h-3" /> Sale Date
                </Label>
                <Input type="date" className="h-12" onChange={(e) => setFormData({...formData, sale_date: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Buy Price (₹)</Label>
                <Input type="number" className="h-12" placeholder="50000" onChange={(e) => setFormData({...formData, purchase_price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Sell Price (₹)</Label>
                <Input type="number" className="h-12" placeholder="75000" onChange={(e) => setFormData({...formData, sale_price: e.target.value})} />
              </div>
            </div>

            <Button 
                onClick={handleCalculate} 
                disabled={loading}
                className="w-full h-14 text-xl font-bold bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Profit"}
            </Button>
          </div>
        </Card>

        {/* Result Card */}
        <Card className="bg-zinc-900 text-white p-8 shadow-2xl border-none flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Est. Capital Gains Tax</p>
              <h2 className="text-6xl font-black mt-2 tracking-tighter">
                {result?.is_slab ? (
                    <span className="text-amber-400 text-4xl">Slab Rate</span>
                ) : (
                    <span className="flex items-center">
                        <IndianRupee className="w-10 h-10 mr-1" />
                        {result?.tax.toLocaleString('en-IN') || "0"}
                    </span>
                )}
              </h2>
            </div>

            {result && (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <div className="p-5 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <p className="text-zinc-400 text-sm font-medium">Net Profit/Loss</p>
                  <p className={`text-2xl font-bold ${result.gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{result.gain.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-700">
                  Classification: {result.type}
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-8 border-t border-zinc-800 flex gap-3">
             <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
             <p className="text-zinc-400 text-xs leading-relaxed">
               LTCG on Equity (held {'>'}1yr) has a ₹1.25L exemption as of FY 2025-26. Property/Gold indexation has been removed.
             </p>
          </div>
        </Card>

      </div>
    </main>
  )
}