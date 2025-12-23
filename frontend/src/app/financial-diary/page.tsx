"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import SidebarNav from "./components/SidebarNav";
import SalaryForm from "./components/SalaryForm";
import PropertyList from "./components/PropertyList";
import InvestmentList from "./components/InvestmentList";
import TaxCharts from "./components/TaxCharts";

export default function FinancialDiaryPage() {
  const [activeSection, setActiveSection] = useState('income');
  const [analysis, setAnalysis] = useState(null);
  
  const methods = useForm({
    defaultValues: { gross_salary: 0, investments: [], properties: [] }
  });

  const onSubmit = async (data: any) => {
    const res = await fetch("http://localhost:8000/analyze-diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    setAnalysis(result);
    // Scroll to analysis after result is set
    setTimeout(() => {
        document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Helper to render only the active section
  const renderSection = () => {
    switch (activeSection) {
      case 'income': return <SalaryForm />;
      case 'property': return <PropertyList />;
      case 'investment': return <InvestmentList />;
      default: return <SalaryForm />;
    }
  };

  const steps = ['income', 'property', 'investment'];

  return (
    <div className="flex bg-white min-h-screen">
      {/* 1. The Ladder (Sidebar) */}
      <SidebarNav 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        completedSteps={analysis ? steps : []} 
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Heading updates based on section */}
              <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 capitalize">
                  {activeSection.replace('-', ' ')}
                </h1>
                <p className="text-slate-500 mt-2">Enter your details to generate your financial analysis.</p>
              </div>

              {/* ONLY THE ACTIVE FORM IS VISIBLE HERE */}
              <div className="min-h-100">
                {renderSection()}
              </div>

              {/* Navigation Buttons (Like the Image) */}
              <div className="flex justify-between items-center pt-10 border-t">
                <button
                  type="button"
                  onClick={() => {
                    const prevIdx = steps.indexOf(activeSection) - 1;
                    if (prevIdx >= 0) setActiveSection(steps[prevIdx]);
                  }}
                  className={`px-6 py-2 border rounded-lg font-bold ${activeSection === 'income' ? 'invisible' : 'visible'}`}
                >
                  Previous step
                </button>

                {activeSection === 'investment' ? (
                  <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700">
                    Generate Analysis
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                        const nextIdx = steps.indexOf(activeSection) + 1;
                        if (nextIdx < steps.length) setActiveSection(steps[nextIdx]);
                    }}
                    className="bg-blue-500 text-white px-10 py-3 rounded-lg font-bold"
                  >
                    Next step
                  </button>
                )}
              </div>
            </form>
          </FormProvider>

          {/* 3. Analysis Dashboard (Hidden until calculation) */}
          {analysis && (
            <div id="analysis-section" className="mt-32 pt-20 border-t-8 border-slate-50">
              <h2 className="text-5xl font-black mb-12 text-slate-800">Your Analysis</h2>
              <TaxCharts data={analysis} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}