# Quantum Gate Simulator

A simple quantum gate simulator web app with a Python backend using Cirq and a JavaScript frontend.

---

## Features

- Add multiple quantum gates (H, X, Y, Z, CNOT, CZ) to a circuit.
- Simulate the quantum circuit on a specified number of qubits (1 to 8).
- View resulting quantum state vector and Dirac notation output.
- Download the full quantum state vector as a JSON file.
- Interactive web interface for easy gate input and simulation.

---

## Tools

- **Backend:** Python, FastAPI, Cirq
- **Frontend:** HTML, CSS, JavaScript
- **Server:** Uvicorn ASGI server

---

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js & npm (optional, if you want to use any frontend build tools)
- Git

### Installation

1. Clone the repository

2. Install backend dependencies: pip install -r requirements.txt

3. From the backend directory, run: uvicorn app:app --reload

4. Open the index.html file with live server

### Usage

1. Enter the number of qubits (1 to 8).

2. Add gates by specifying the gate name, target qubits, and control qubits (if any).

3. Click Add Gate to add to the circuit list.

4. Click Simulate to run the simulation.

5. Click Download to see full notations.

6. Click Clear Gates to remove existing gates.

## Limitations and Future Work

- The visualization is limited to text-based outputs. Bloch sphere visualizations are not yet implemented.
- Bloch sphere representations for individual qubits are planned to be integrated in a future update to provide intuitive geometric visualization of qubit states.
- This project is a work in progress so enhancements to error handling, performance optimization, and support for more complex gates and multi-qubit operations are ongoing.

Stay tuned for updates and improvements!

