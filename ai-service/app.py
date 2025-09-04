# ai-service/app.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI(title="FoodPrint AI Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_model = None

def _train_demo_model():
    global _model
    if _model is not None:
        return
    # Synthetic training data (demo)
    X = []
    y = []
    rng = np.random.default_rng(42)
    for i in range(120):
        prepared = rng.integers(60, 180)
        served = prepared - rng.integers(0, 50)
        next_day = max(0, served + rng.integers(-15, 15))
        X.append([prepared, served])
        y.append(next_day)
    _model = LinearRegression().fit(np.array(X), np.array(y))

class HistoryPoint(BaseModel):
    prepared: float
    served: float
    leftover: Optional[float] = 0
    weather: Optional[str] = None
    is_holiday: Optional[bool] = False

class PredictRequest(BaseModel):
    history: List[HistoryPoint]

class PredictResponse(BaseModel):
    predicted_demand: float

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    _train_demo_model()
    if not req.history:
        return PredictResponse(predicted_demand=0.0)
    # simple demo: use last day's prepared & served
    last = req.history[-1]
    X = np.array([[last.prepared, last.served]])
    pred = float(_model.predict(X)[0])
    return PredictResponse(predicted_demand=max(0.0, round(pred, 2)))

# Allocation endpoints (baseline greedy)
class NGO(BaseModel):
    id: str
    name: str
    demand: float

class AllocateRequest(BaseModel):
    surplus: float
    ngos: List[NGO]

class Allocation(BaseModel):
    ngoId: str
    ngoName: str
    meals: float

class AllocateResponse(BaseModel):
    allocated: List[Allocation]
    leftover: float

@app.post("/allocate", response_model=AllocateResponse)
def allocate(req: AllocateRequest):
    remaining = req.surplus
    sorted_ngos = sorted(req.ngos, key=lambda n: n.demand, reverse=True)
    out = []
    for ngo in sorted_ngos:
        if remaining <= 0: break
        give = min(ngo.demand, remaining)
        out.append(Allocation(ngoId=ngo.id, ngoName=ngo.name, meals=float(give)))
        remaining -= give
    return AllocateResponse(allocated=out, leftover=float(max(0, remaining)))

# Toy "quantum" endpoint — same output but labelled for demo/pitch
@app.post("/allocate_qaoa", response_model=AllocateResponse)
def allocate_qaoa(req: AllocateRequest):
    # In production: formulate QUBO + run QAOA. For hackathon reliability, reuse greedy result.
    return allocate(req)
