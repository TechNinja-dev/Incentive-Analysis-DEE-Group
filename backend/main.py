from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,EmailStr
from typing import List,Optional
from fastapi.middleware.cors import CORSMiddleware
from incentive import calculate
from encryption import hash_password,verify_password
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn=MongoClient(os.getenv("mongo_uri"))
db=conn["DEE_Employee"]
coll=db["Employee"]



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

class SignupRequest(BaseModel):
    name:str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@app.post("/signup")
def signup(data: SignupRequest):
    # check if user already exists
    existing_user = coll.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(data.password)

    coll.insert_one({
        "name":data.name,
        "email": data.email,
        "password": hashed_pwd
    })

    return {"message": "Signup successful"}


@app.post("/login")
def login(data: LoginRequest):
    user = coll.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "email": user["email"]
    }



@app.post("/incentives")
def receive_incentives(data: IncentiveRequest):
    print("🔥 INCENTIVE API HIT")

    return calculate(data)
