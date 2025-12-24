from fastapi import FastAPI,HTTPException
from pydantic import BaseModel,EmailStr
from typing import List,Optional,Dict
from fastapi.middleware.cors import CORSMiddleware
from incentive import calculate
from encryption import hash_password,verify_password
import os
from datetime import datetime
import requests

from dotenv import load_dotenv
from pymongo import MongoClient,DESCENDING

load_dotenv()
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://incentive-analysis-dee-group.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn=MongoClient(os.getenv("mongo_uri"))
if conn:
    print("CONNECTED TO MONGO")
db=conn["DEE_Employee"]
coll_admin=db["Admin"]
car_details=db["Cars_Details"]
gbl_amt=db['Global_Amount']



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

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class CarConfig(BaseModel):
    min_slab: int
    amount: int

class Record(BaseModel):
    month:str
    overall_amt:int
    configs: Dict[str,CarConfig]


class ContactRequest(BaseModel):
    full_name: str
    email: str
    subject: str
    message: str


@app.get("/")
def health():
    return {"status": "ok"}



@app.post("/addAdmin")
def add_admin(data: AdminCreate):
    existing = coll_admin.find_one({"email": data.email})

    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")

    hashed_pw = hash_password(data.password)

    coll_admin.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hashed_pw
    })

    return {"message": "Admin created successfully"}


@app.post("/login")
def login(data: LoginRequest):
    user = coll_admin.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if len(data.password.encode("utf-8")) > 72:
        raise HTTPException(status_code=400, detail="Invalid password length")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "name":user['name'],
        "email": user["email"]
    }



@app.post("/incentives")
def receive_incentives(data: IncentiveRequest):
    print("🔥 INCENTIVE API HIT")

    return calculate(data)

@app.post("/load")
def load_record(data: Record):
    latest = car_details.find_one({}, sort=[("month", DESCENDING)])

    # 🔑 convert CarConfig objects to dict
    configs_dict = {
        car: cfg.dict()
        for car, cfg in data.configs.items()
    }

    gbl_amt.update_one(
        {"month": data.month},
        {"$set": {"month": data.month, "amount": data.overall_amt}},
        upsert=True
    )
    if latest and latest["month"] == data.month:
        car_details.update_one(
            {"_id": latest["_id"]},
            {"$set": {"configs": configs_dict}}
        )
        return {"message": "Existing month updated"}

    car_details.insert_one({
        "month": data.month,
        "configs": configs_dict
    })


    return {"message": "New month record inserted"}



@app.get("/load/latest")
def get_latest_config():
    latest_config = car_details.find_one(
        {},
        sort=[("month", DESCENDING)],
        projection={"_id": 0, "configs": 1, "month": 1}
    )

    if not latest_config:
        return {
            "configs": {},
            "overall_amt": 0
        }

    latest_amt = gbl_amt.find_one(
        {"month": latest_config["month"]},
        projection={"_id": 0, "amount": 1}
    )

    return {
        "configs": latest_config.get("configs", {}),
        "overall_amt": latest_amt["amount"] if latest_amt else 0
    }



@app.options("/{path:path}")
def options_handler(path: str):
    return Response(status_code=200)


    
