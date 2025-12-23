import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Home, Trash2 } from "lucide-react";

export default function PropertyList() {
  const { register, control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "properties",
  });

  return (
    <div className="space-y-4 p-6 border-2 border-slate-100 rounded-xl bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-orange-600">
          <Home size={20} />
          <h3 className="font-bold text-lg">Real Estate & Home Loans</h3>
        </div>
        <button
          type="button"
          onClick={() => append({ property_name: "", rental_income: 0, municipal_taxes: 0, loan_interest: 0, is_self_occupied: false })}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition"
        >
          <Plus size={16} /> Add Property
        </button>
      </div>

      {fields.map((field, index) => {
        const isSOP = watch(`properties.${index}.is_self_occupied`);
        return (
          <div key={field.id} className="p-4 border rounded-lg bg-slate-50 relative space-y-3">
            <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-400">Property Name / Address</label>
                <input {...register(`properties.${index}.property_name`)} className="w-full border p-2 rounded" placeholder="e.g. Skyline Apartments" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" {...register(`properties.${index}.is_self_occupied`)} className="w-4 h-4" />
                <label className="text-sm font-medium">Self-Occupied?</label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!isSOP && (
                <>
                  <div>
                    <label className="text-xs text-gray-500">Annual Rent Income</label>
                    <input type="number" {...register(`properties.${index}.rental_income`, { valueAsNumber: true })} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Municipal Taxes Paid</label>
                    <input type="number" {...register(`properties.${index}.municipal_taxes`, { valueAsNumber: true })} className="w-full border p-2 rounded" />
                  </div>
                </>
              )}
              <div className={isSOP ? "md:col-span-3" : ""}>
                <label className="text-xs text-gray-500">Annual Home Loan Interest</label>
                <input type="number" {...register(`properties.${index}.loan_interest`, { valueAsNumber: true })} className="w-full border p-2 rounded text-red-600 font-medium" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}