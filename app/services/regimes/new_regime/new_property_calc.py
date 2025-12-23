def calculate_property_income_new(properties: list) -> float:
    total_property_income = 0
    
    for p in properties:
        if p.is_self_occupied:
            # Interest on SOP is NIL in New Regime
            continue
        else:
            # Let-out property: Municipal taxes and 30% Std Deduction allowed
            nav = p.rental_income - p.municipal_taxes
            # Interest on loan for rented property is still deductible
            taxable_rent = (nav * 0.70) - p.loan_interest
            
            # Restriction: Loss from HP cannot be set off against Salary in New Regime
            total_property_income += max(0, taxable_rent)
            
    return float(total_property_income)