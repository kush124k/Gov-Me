def calculate_property_income_old(properties: list) -> float:
    total_property_impact = 0.0
    
    for p in properties:
        if p.is_self_occupied:
            # Deduction for SOP interest up to 2 Lakhs
            # This creates a 'negative' income (loss)
            total_property_impact -= min(p.loan_interest, 200000)
        else:
            # Let-out property: No cap on interest deduction
            nav = p.rental_income - p.municipal_taxes
            taxable_rent = (nav * 0.70) - p.loan_interest
            total_property_impact += taxable_rent
            
    # Max loss set-off against other income (Salary) is capped at 2 Lakhs
    if total_property_impact < -200000:
        return -200000.0
    return float(total_property_impact)

