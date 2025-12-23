def calculate_slab_tax(taxable_income: float) -> float:
    """Calculates tax based on the granular slabs of the New Regime (FY 2025-26)."""
    # Rebate 87A: Nil tax if total income <= 12L
    if taxable_income <= 1200000:
        return 0.0
    
    tax = 0
    # Slabs for FY 25-26
    if taxable_income > 2400000:
        tax += (taxable_income - 2400000) * 0.30
        taxable_income = 2400000
    if taxable_income > 2000000:
        tax += (taxable_income - 2000000) * 0.25
        taxable_income = 2000000
    if taxable_income > 1600000:
        tax += (taxable_income - 1600000) * 0.20
        taxable_income = 1600000
    if taxable_income > 1200000:
        tax += (taxable_income - 1200000) * 0.15
        taxable_income = 1200000
    if taxable_income > 800000:
        tax += (taxable_income - 800000) * 0.10
        taxable_income = 800000
    if taxable_income > 400000:
        tax += (taxable_income - 400000) * 0.05

    return float(tax)

def process_salary_income(gross_salary: float) -> float:
    # Standard deduction is 75,000 in New Regime
    return max(0, gross_salary - 75000)