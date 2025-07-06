import cirq

def simulate_circuit(gates_list, num_qubits):
    qubits = [cirq.LineQubit(i) for i in range(num_qubits)]
    circuit = cirq.Circuit()

    for gate_info in gates_list:
        gate_name = gate_info['gate_name'].lower()
        targets = gate_info.get('targets', [])
        controls = gate_info.get('controls', [])

        if gate_name == 'h':
            for t in targets:
                circuit.append(cirq.H(qubits[t]))
        elif gate_name == 'x':
            for t in targets:
                circuit.append(cirq.X(qubits[t]))
        elif gate_name == 'y':
            for t in targets:
                circuit.append(cirq.Y(qubits[t]))
        elif gate_name == 'z':
            for t in targets:
                circuit.append(cirq.Z(qubits[t]))
        elif gate_name in ('cx', 'cnot'):
            for ctrl, tgt in zip(controls, targets):
                circuit.append(cirq.CNOT(qubits[ctrl], qubits[tgt]))
        elif gate_name == 'cz':
            for ctrl, tgt in zip(controls, targets):
                circuit.append(cirq.CZ(qubits[ctrl], qubits[tgt]))
        else:
            print(f"Unknown gate: {gate_name}")

    simulator = cirq.Simulator()
    result = simulator.simulate(circuit)

    state_vector = result.final_state_vector
    probabilities = result.dirac_notation()

    return {
        "circuit": str(circuit),
        "state_vector": [str(amplitude) for amplitude in state_vector],
        "dirac_notation": probabilities
    }
