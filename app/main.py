from fastapi import FastAPI
# Note: When running from root, use absolute imports
from app.services.tax_engine import calculate_tax_with_relief 
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Gov&Me Tax Portal")

# FIX: Add CORS Middleware so the browser doesn't block the request
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://gov-me.vercel.app",  # Removed the trailing slash
        "http://localhost:3000",      # Add local Next.js dev port
        "http://127.0.0.1:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Tax & Subsidy Visualizer"}

@app.post("/services/tax_engine")
def get_tax(taxable_income: float, category: str, high_turnover: bool = False ):
    # This calls your logic from services/tax_engine.py
    result = calculate_tax_with_relief(taxable_income, category, high_turnover)
    return {"tax_details": result}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 