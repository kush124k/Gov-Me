def calculate_investment_tax(investments: list) -> dict:
    total_equity_ltcg = 0
    total_equity_stcg = 0
    total_other_ltcg = 0  # Gold, unlisted property, etc.
    
    for inv in investments:
        gain = inv.sell_price - inv.buy_price
        if gain <= 0: continue
            
        if inv.asset_type == "equity":
            if inv.is_long_term: total_equity_ltcg += gain
            else: total_equity_stcg += gain
        else:
            if inv.is_long_term: total_other_ltcg += gain
            else: # Short term debt/gold is added to slab income, handled elsewhere
                pass 

    # LTCG on equity: 12.5% on amount above 1.25L
    equity_ltcg_tax = max(0, total_equity_ltcg - 125000) * 0.125
    equity_stcg_tax = total_equity_stcg * 0.20
    other_ltcg_tax = total_other_ltcg * 0.125 # Standardized rate post-July 2024
    
    return {
        "investment_tax": equity_ltcg_tax + equity_stcg_tax + other_ltcg_tax,
        "breakdown": {
            "ltcg_equity_tax": round(equity_ltcg_tax, 2),
            "stcg_equity_tax": round(equity_stcg_tax, 2),
            "other_ltcg_tax": round(other_ltcg_tax, 2)
        }
    }