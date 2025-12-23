"use client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function TaxCharts({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Side-by-Side Comparison Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold mb-6 text-slate-700">Regime Comparison</h3>
        <div className="h-100 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.comparison_chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="top" align="right" iconType="circle" height={36}/>
              <Bar dataKey="Old Regime" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="New Regime" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Tax Composition (New Regime) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-slate-700">New Regime Breakdown</h3>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.details.new.chart_data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.details.new.chart_data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Tax Shield (Old Regime Savings) */}
        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Old Regime Tax Shield</h3>
          <p className="text-indigo-100 mb-8">How much your investments and home loan reduced your taxable income.</p>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-indigo-500 pb-2">
              <span>Standard Deductions</span>
              <span className="font-bold">₹{data.details.old.tax_shield.deductions_saved.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-indigo-500 pb-2">
              <span>Property Loss Benefit</span>
              <span className="font-bold">₹{data.details.old.tax_shield.property_loss_benefit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}