import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

export default function InvestmentList() {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "investments",
  });

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Investments (Stocks/Mutual Funds/Gold)</h3>
        <button
          type="button"
          onClick={() => append({ asset_name: "", buy_price: 0, sell_price: 0, asset_type: "equity", is_long_term: true })}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
        >
          <Plus size={16} /> Add Investment
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-5 gap-2 items-end border-b pb-4">
          <div className="col-span-1">
            <label className="text-xs text-gray-500">Asset Name</label>
            <input {...register(`investments.${index}.asset_name`)} className="w-full border p-2 rounded" placeholder="e.g. HDFC Bank" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Buy Price</label>
            <input type="number" {...register(`investments.${index}.buy_price`)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Sell Price</label>
            <input type="number" {...register(`investments.${index}.sell_price`)} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Type</label>
            <select {...register(`investments.${index}.asset_type`)} className="w-full border p-2 rounded">
              <option value="equity">Equity</option>
              <option value="gold">Gold</option>
              <option value="debt">Debt</option>
            </select>
          </div>
          <button type="button" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50 p-2 rounded w-fit">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}
