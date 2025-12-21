'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalculationPage() {
  const [income, setIncome] = useState("");
  const [category, setCategory] = useState("Individual");
  const [isHighTurnover, setIsHighTurnover] = useState(false);
  const [tax, setTax] = useState<number | null>(null);

  const handleCalculate = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${backendUrl}/services/tax_engine?=${income}&category=${category}&high_turnover=${isHighTurnover}`, {
        method: 'POST',
      });
      const data = await res.json();
      setTax(data.tax_details);
    } catch (e) {
      alert("Check FastAPI! Is it running?");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
        <Card className="p-8 shadow-2xl border-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-3xl font-bold">Tax Profiling</CardTitle>
          </CardHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Taxpayer Category</Label>
              <Select onValueChange={setCategory} defaultValue={category}>
                <SelectTrigger className="h-12 text-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="HUF">HUF</SelectItem>
                  <SelectItem value="DomesticCompany">Domestic Company</SelectItem>
                  <SelectItem value="ForeignCompany">Foreign Company</SelectItem>
                  <SelectItem value="Firms">Firms</SelectItem>
                  <SelectItem value="LLP">LLP</SelectItem>
                  <SelectItem value="CoOpSociety">Co-operative Society</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {category === "DomesticCompany" && (
              <div className="flex items-center justify-between p-4 bg-zinc-100 rounded-lg animate-in slide-in-from-top-2">
                <div className="space-y-0.5">
                  <Label>Turnover {'>'} ₹400 Cr?</Label>
                  <p className="text-xs text-zinc-500">Affects base tax rate (25% vs 30%)</p>
                </div>
                <Switch checked={isHighTurnover} onCheckedChange={setIsHighTurnover} />
              </div>
            )}

            <div className="space-y-2">
              <Label>Annual Taxable Income (INR)</Label>
              <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="h-12 text-lg" />
            </div>
            <Button onClick={handleCalculate} className="w-full h-14 text-xl font-bold">Analyze Duty</Button>
          </div>
        </Card>

        <Card className="bg-zinc-900 text-white p-8 shadow-2xl border-none flex flex-col justify-between">
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Duty Calculated</p>
            <h2 className="text-8xl font-black mt-4 tracking-tighter">₹{tax !== null ? tax.toLocaleString('en-IN') : "0"}</h2>
          </div>
          <div className="pt-8 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm italic">"Your fiscal duty fuels the nation. Next, we check your rights."</p>
          </div>
        </Card>
      </div>
    </main>
  )
}