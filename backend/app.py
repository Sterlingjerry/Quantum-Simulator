# backend/app.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from quantum_simulator import simulate_circuit

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GateInput(BaseModel):
    gate_name: str
    targets: List[int]
    controls: List[int] = []

class SimulationRequest(BaseModel):
    num_qubits: int
    gates: List[GateInput]

@app.get("/")
def read_root():
    return {"message": "Quantum Gate Simulator API is running."}

@app.post("/simulate/")
def simulate(simulation: SimulationRequest):
    gates_list = [gate.dict() for gate in simulation.gates]
    result = simulate_circuit(gates_list, simulation.num_qubits)
    return result
