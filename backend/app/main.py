
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Smart Roster Management System",
    description="Employee scheduling and roster optimization API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmployeeCreate(BaseModel):
    name: str
    role: str
    brand: str
    pod: str
    status: str = "Available"

employees = [
    {
        "id": 1,
        "name": "Aarav Sharma",
        "role": "Support Executive",
        "brand": "Brand A",
        "pod": "Pod Alpha",
        "status": "Available",
    },
    {
        "id": 2,
        "name": "Priya Patil",
        "role": "Senior Executive",
        "brand": "Brand B",
        "pod": "Pod Beta",
        "status": "Available",
    },
    {
        "id": 3,
        "name": "Rohan Desai",
        "role": "Support Executive",
        "brand": "Brand C",
        "pod": "Pod Alpha",
        "status": "On Leave",
    },
]

@app.get("/")
def home():
    return {
        "message": "Smart Roster Management System API is running"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/employees")
def get_employees():
    return employees

@app.post("/api/employees", status_code=201)
def create_employee(employee: EmployeeCreate):
    new_employee = employee.model_dump()
    new_employee["id"] = max(
        (item["id"] for item in employees),
        default=0,
    ) + 1

    employees.append(new_employee)
    return new_employee
