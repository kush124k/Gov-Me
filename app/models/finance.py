from pydantic import BaseModel
from typing import List, Optional

class InvestmentEntry(BaseModel):
    asset_name: str
    buy_price: float
    sell_price: float
    asset_type: str  # e.g., "equity", "debt", "gold", "property"
    is_long_term: bool

class PropertyEntry(BaseModel):
    property_name: str
    rental_income: float = 0
    municipal_taxes: float = 0
    loan_interest: float = 0
    is_self_occupied: bool = False

class FinancialDiaryRequest(BaseModel):
    gross_salary: float
    other_deductions_80c: float = 0
    health_insurance: float = 0
    nps_voluntary: float = 0
    investments: List[InvestmentEntry] = []
    properties: List[PropertyEntry] = []