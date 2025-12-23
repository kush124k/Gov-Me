import { CheckCircle2, Circle } from "lucide-react";

const steps = [
  { id: 'income', label: 'Salary & Incomes' },
  { id: 'property', label: 'Property & Loans' },
  { id: 'investment', label: 'Investments' },
];

export default function SidebarNav({ activeSection, onNavigate, completedSteps }: any) {
  return (
    <div className="w-72 bg-slate-50 border-r min-h-screen p-8 hidden md:block">
      <h2 className="text-xl font-bold mb-10 text-slate-800">My Financial Diary</h2>
      <nav className="space-y-8 relative">
        {/* Vertical Line Connector */}
        <div className="absolute left-3.75 top-2 bottom-2 w-0.5 bg-slate-200 z-0" />
        
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onNavigate(step.id)}
            className="flex items-start gap-4 w-full group relative z-10"
          >
            <div className={`mt-1 transition-colors ${
              activeSection === step.id ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {completedSteps.includes(step.id) ? (
                <CheckCircle2 size={32} className="bg-white rounded-full" />
              ) : (
                <Circle size={32} className={`bg-white rounded-full ${
                  activeSection === step.id ? 'fill-blue-50 stroke-blue-600' : ''
                }`} />
              )}
            </div>
            <div className="text-left">
              <p className={`text-sm font-bold transition-colors ${
                activeSection === step.id ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {step.label}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Enter Details</p>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}