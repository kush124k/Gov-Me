from .income_calc import calculate_slab_tax_old, process_salary_income_old
from .investment_calc import calculate_deductions_old
from .property_calc import calculate_property_income_old

def calculate_old_total(data):
    # 1. Component calculations
    salary_base = process_salary_income_old(data.gross_salary)
    property_impact = calculate_property_income_old(data.properties)
    deductions = calculate_deductions_old(data)
    
    # 2. Total Taxable Income (Salary + Property - Deductions)
    total_taxable_slab = max(0, salary_base + property_impact - deductions)
    slab_tax = calculate_slab_tax_old(total_taxable_slab)
    
    # 3. Aggregation (Assuming investment tax rates are same for both regimes now)
    # Import from a shared utility or use the same logic
    from ..new_regime.investment_calc import calculate_investment_tax
    inv_analysis = calculate_investment_tax(data.investments)
    
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
        "tax_shield": {
            "deductions_saved": deductions,
            "property_loss_benefit": abs(min(0, property_impact))
        }
    }
    