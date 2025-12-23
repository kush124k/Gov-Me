def calculate_slab_tax_old(taxable_income: float) -> float:
    """Calculates tax based on Old Regime slabs for individuals < 60 years."""
    # Rebate 87A: Tax is NIL if total income <= 5 Lakhs
    if taxable_income <= 500000:
        return 0.0
    
    tax = 0.0
    if taxable_income > 1000000:
        tax += (taxable_income - 1000000) * 0.30
        taxable_income = 1000000
    if taxable_income > 500000:
        tax += (taxable_income - 500000) * 0.20
        taxable_income = 500000
    if taxable_income > 250000:
        tax += (taxable_income - 250000) * 0.05
        
    return float(tax)

def process_salary_income_old(gross_salary: float) -> float:
    # Standard deduction is fixed at 50,000 in Old Regime
    return max(0, gross_salary - 50000)