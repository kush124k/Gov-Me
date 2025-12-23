from app.services.regimes.new_regime.new_income_calc import calculate_slab_tax, process_salary_income
from app.services.regimes.new_regime.new_investment_calc import calculate_investment_tax
from app.services.regimes.new_regime.new_property_calc import calculate_property_income_new

def calculate_new_total(data):
    # 1. Component calculations
    salary_taxable = process_salary_income(data.gross_salary)
    property_income = calculate_property_income_new(data.properties)
    inv_analysis = calculate_investment_tax(data.investments)
    
    # 2. Total Slab Income
    total_taxable_slab = salary_taxable + property_income
    slab_tax = calculate_slab_tax(total_taxable_slab)
    
    # 3. Final Aggregation
    total_tax = slab_tax + inv_analysis["investment_tax"]
    cess = total_tax * 0.04
    
    return {
        "total_tax": round(total_tax + cess, 2),
        "components": {
            "slab_tax": round(slab_tax, 2),
            "investment_tax": inv_analysis["investment_tax"],
            "cess": round(cess, 2)
        },
        "chart_data": [
            {"name": "Slab Tax", "value": round(slab_tax, 2)},
            {"name": "Investment Tax", "value": inv_analysis["investment_tax"]},
            {"name": "Cess (4%)", "value": round(cess, 2)}
        ],
        "metadata": {
            "taxable_income": total_taxable_slab,
            "standard_deduction": 75000
        }
    }