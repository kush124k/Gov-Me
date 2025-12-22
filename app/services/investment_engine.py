from pydantic import BaseModel
from datetime import date
from typing import Dict, Any

class InvestmentInput(BaseModel):
    asset_type: str  # "Equity", "RealEstate", "Gold"
    purchase_price: float
    sale_price: float
    purchase_date: date
    sale_date: date

def calculate_investment_tax_logic(data: InvestmentInput) -> Dict[str, Any]:
    gain = data.sale_price - data.purchase_price
    if gain <= 0:
        return {"gain": round(gain, 2), "tax": 0.0, "type": "Loss", "is_slab": False}

    holding_days = (data.sale_date - data.purchase_date).days
    holding_months = holding_days / 30.44
    
    tax_amount = 0.0
    category = ""
    is_slab = False

    # 1. LISTED EQUITY / EQUITY-ORIENTED MUTUAL FUNDS
    if data.asset_type == "Equity":
        if holding_months > 12:
            category = "LTCG (Section 112A)"
            # Exemption limit increased to ₹1.25 Lakh for FY 2025-26
            taxable_gain = max(0, gain - 125000)
            tax_amount = taxable_gain * 0.125  # 12.5% Rate
        else:
            category = "STCG (Section 111A)"
            tax_amount = gain * 0.20  # Increased to 20%

    # 2. PHYSICAL REAL ESTATE & GOLD
    elif data.asset_type in ["RealEstate", "Gold"]:
        if holding_months > 24:
            category = "LTCG (Section 112)"
            # Uniform 12.5% rate without indexation for assets sold after July 23, 2024
            tax_amount = gain * 0.125
        else:
            category = "STCG"
            is_slab = True  # Taxed at normal income tax slab rates
            tax_amount = 0.0

    return {
        "gain": round(gain, 2),
        "tax": round(tax_amount, 2),
        "type": category,
        "is_slab": is_slab,
        "holding_period": f"{round(holding_months, 1)} months"
    }