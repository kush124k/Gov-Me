from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Existing Service Imports
from app.services.tax_engine import calculate_tax_with_relief 
from app.services.investment_engine import calculate_investment_tax_logic, InvestmentInput

# New Financial Diary Imports
from app.models.finance import FinancialDiaryRequest, InvestmentEntry, PropertyEntry
from app.services.regimes.old_regime.old_calculator import calculate_old_total
from app.services.regimes.new_regime.new_calculator import calculate_new_total

app = FastAPI(title="Gov&Me Tax Portal")

# CORS Middleware (Preserved)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gov-me.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tax & Subsidy Visualizer"}

@app.post("/services/tax_engine")
def get_tax(taxable_income: float, category: str, high_turnover: bool = False ):
    result = calculate_tax_with_relief(taxable_income, category, high_turnover)
    return {"tax_details": result}

@app.post("/services/investment_tax")
def get_investment_tax(data: InvestmentInput):
    return calculate_investment_tax_logic(data)

# --- NEW: FINANCIAL DIARY ROUTE ---
@app.post("/analyze-diary")
def analyze_financial_diary(data: FinancialDiaryRequest):
    """
    Combines Salary, Property, and Investments to provide a 
    comparison for frontend charts.
    """
    old_res = calculate_old_total(data)
    new_res = calculate_new_total(data)
    
    # Data formatted specifically for Recharts/Chart.js bar graphs
    comparison_chart = [
        {
            "label": "Total Tax",
            "Old Regime": old_res["total_tax"],
            "New Regime": new_res["total_tax"]
        },
        {
            "label": "Income Tax (Slab)",
            "Old Regime": old_res["components"]["slab_tax"],
            "New Regime": new_res["components"]["slab_tax"]
        }
    ]
    
    return {
        "summary": {
            "best_regime": "New" if new_res["total_tax"] < old_res["total_tax"] else "Old",
            "savings": round(abs(old_res["total_tax"] - new_res["total_tax"]), 2)
        },
        "comparison_chart": comparison_chart,
        "details": {
            "old": old_res,
            "new": new_res
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)