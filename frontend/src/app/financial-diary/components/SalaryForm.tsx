import { useFormContext } from "react-hook-form";
import { Landmark, ShieldCheck } from "lucide-react";

export default function SalaryForm() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Primary Income */}
      <div className="bg-white p-6 rounded-xl border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-blue-700">
          <Landmark size={20} />
          <h3 className="font-bold text-lg">Annual Salary Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Gross Annual Salary</label>
            <input 
              type="number" 
              {...register("gross_salary", { valueAsNumber: true })} 
              className="w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="e.g. 1200000"
            />
          </div>
        </div>
      </div>

      {/* Deductions (Old Regime Benefits) */}
      <div className="bg-white p-6 rounded-xl border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-purple-700">
          <ShieldCheck size={20} />
          <h3 className="font-bold text-lg">Deductions (Optional)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500">80C (LIC, PPF, ELSS)</label>
            <input type="number" {...register("other_deductions_80c", { valueAsNumber: true })} className="w-full border p-2 rounded" placeholder="Max 1.5L" />
          </div>
          <div>
            <label className="text-xs text-gray-500">80D (Health Insurance)</label>
            <input type="number" {...register("health_insurance", { valueAsNumber: true })} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500">80CCD (NPS Voluntary)</label>
            <input type="number" {...register("nps_voluntary", { valueAsNumber: true })} className="w-full border p-2 rounded" placeholder="Max 50k" />
          </div>
        </div>
      </div>
    </div>
  );
}