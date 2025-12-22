from fastapi import FastAPI
from pydantic import BaseModel
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware
from incentive import calculate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class CarData(BaseModel):
    name: str
    quantity: int
    min_slab: int
    total_amount: int

class IncentiveRequest(BaseModel):
    target: int
    tenure: Optional[int] = None
    total_quantity: int
    cars: List[CarData]



@app.post("/incentives")
def receive_incentives(data: IncentiveRequest):
    print("🔥 INCENTIVE API HIT")

    return calculate(data)
