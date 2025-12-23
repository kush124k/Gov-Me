def calculate_deductions_old(data):
    """
    Old Regime Deductions:
    - 80C: Investments (PPF, ELSS, etc.) - Max ₹1.5L
    - 80D: Health Insurance - Max ₹25k (self), ₹50k (senior)
    - 80CCD(1B): NPS - Additional ₹50k
    """
    total = 0
    
    # Section 80C
    total += min(data.other_deductions_80c, 150000)
    
    # Section 80D
    total += min(data.health_insurance, 25000)
    
    # Section 80CCD(1B)
    total += min(data.nps_voluntary, 50000)
    
    return float(total)
