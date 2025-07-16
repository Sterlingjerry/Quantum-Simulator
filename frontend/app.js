const gateList = [];
const gateListElement = document.getElementById('gate-list');
const resultElement = document.getElementById('result');

const gateNameInput = document.getElementById('gate-name');
const targetsInput = document.getElementById('targets');
const controlsInput = document.getElementById('controls');
const numQubitsInput = document.getElementById('num-qubits');

let simulationData = null;  

document.getElementById('add-gate').addEventListener('click', () => {
    const gateName = gateNameInput.value.trim().toUpperCase();
    const targets = targetsInput.value
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));
    const controls = controlsInput.value
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

    if (!gateName) {
        alert('Please enter a gate name (e.g., H, X, CNOT).');
        gateNameInput.focus();
        return;
    }

    if (targets.length === 0) {
        alert('Please enter at least one target qubit index (comma-separated if multiple).');
        targetsInput.focus();
        return;
    }

    const numQubits = parseInt(numQubitsInput.value);
    const invalidTarget = targets.find(q => q < 0 || q >= numQubits);
    const invalidControl = controls.find(q => q < 0 || q >= numQubits);
    if (invalidTarget !== undefined) {
        alert(`Target qubit index ${invalidTarget} is out of range (0 to ${numQubits - 1}).`);
        targetsInput.focus();
        return;
    }
    if (controls.length > 0 && invalidControl !== undefined) {
        alert(`Control qubit index ${invalidControl} is out of range (0 to ${numQubits - 1}).`);
        controlsInput.focus();
        return;
    }

    const gate = { gate_name: gateName, targets, controls };
    gateList.push(gate);

    const targetLabels = targets.map(t => `q${t}`).join(', ');
    const controlLabels = controls.map(c => `q${c}`).join(', ');

    const listItem = document.createElement('li');
    listItem.textContent = `Gate: ${gateName}, Targets: ${targetLabels}` +
        (controls.length > 0 ? `, Controls: ${controlLabels}` : '');
    gateListElement.appendChild(listItem);

    gateNameInput.value = '';
    targetsInput.value = '';
    controlsInput.value = '';
    gateNameInput.focus();
});

// Clear gates button handler
document.getElementById('clear-gates').addEventListener('click', () => {
    gateList.length = 0;
    gateListElement.innerHTML = '';
    resultElement.textContent = '';
    gateNameInput.value = '';
    targetsInput.value = '';
    controlsInput.value = '';
    numQubitsInput.value = '';
    simulationData = null;
    gateNameInput.focus();
});

// Download simulation data button handler
document.getElementById('download-state').addEventListener('click', () => {
    if (!simulationData) {
        alert('No simulation data available to download yet.');
        return;
    }
    const blob = new Blob([JSON.stringify(simulationData.state_vector, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_state_vector.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('simulator-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const numQubits = parseInt(numQubitsInput.value);
    if (gateList.length === 0) {
        alert('Please add at least one gate before simulating.');
        return;
    }
    if (isNaN(numQubits) || numQubits < 1 || numQubits > 8) {
        alert('Please enter a valid number of qubits between 1 and 8.');
        numQubitsInput.focus();
        return;
    }

    resultElement.textContent = 'Simulating...';

    try {
        const response = await fetch('http://127.0.0.1:8000/simulate/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ num_qubits: numQubits, gates: gateList }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status}\n${errorText}`);
        }

        simulationData = await response.json();

        resultElement.textContent =
            `✨ Quantum Gate Simulator Result ✨\n\n` +
            `🪐 Circuit:\n${simulationData.circuit}\n\n` +
            `🧬 State Summary:\n` +
            `- Number of Qubits: ${numQubits}\n` +
            `- Total Possible States: ${Math.pow(2, numQubits)}\n` +
            `- Each state has amplitude: ~${(1 / Math.sqrt(Math.pow(2, numQubits))).toFixed(3)}\n\n` +
            `📜 Example States:\n` +
            `${simulationData.dirac_notation.split(' + ').slice(0, 8).join(' + ')} + ...\n\n` +
            `🪐 Full state vector available on download for advanced analysis.`;

    } catch (error) {
        resultElement.textContent = `Error: ${error.message}`;
    }
});
