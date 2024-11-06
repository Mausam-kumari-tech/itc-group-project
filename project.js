// Function to generate matrix input fields
function generateMatrixInput() {
    const matrixRows = document.getElementById('rows').value;
    const matrixColumns = document.getElementById('columns').value;

    // Clear previous inputs if any
    const matrixInputs = document.getElementById('matrix-inputs');
    matrixInputs.innerHTML = '';

    if (!matrixRows || !matrixColumns || matrixRows < 2 || matrixColumns < 2) {
        alert("Please enter valid dimensions for rows and columns.");
        return;
    }

    // Create the matrix input fields dynamically
    for (let i = 0; i < matrixRows; i++) {
        let row = document.createElement('div');
        row.classList.add('matrix-row');
        for (let j = 0; j < matrixColumns; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.id = `cell-${i}-${j}`;
            input.placeholder = `A[${i + 1}][${j + 1}]`;
            row.appendChild(input);
        }
        matrixInputs.appendChild(row);
    }
}

// Function to calculate LDU decomposition
function calculateLDU() {
    const matrixRows = parseInt(document.getElementById('rows').value);
    const matrixColumns = parseInt(document.getElementById('columns').value);
    const matrix = [];

    // Retrieve matrix values from input
    for (let i = 0; i < matrixRows; i++) {
        let row = [];
        for (let j = 0; j < matrixColumns; j++) {
            const cellValue = document.getElementById(`cell-${i}-${j}`).value;
            row.push(parseFloat(cellValue));
        }
        matrix.push(row);
    }

    if (matrixRows !== matrixColumns) {
        alert("LDU factorization is only for square matrices.");
        return;
    }

    const { L, D, U, steps } = LDUFactorization(matrix, matrixRows);
    displaySteps(steps);
    displayMatrices(L, D, U);
}

// Function to perform LDU factorization
function LDUFactorization(A, n) {
    let L = Array.from({ length: n }, () => Array(n).fill(0));
    let D = Array.from({ length: n }, () => Array(n).fill(0));
    let U = JSON.parse(JSON.stringify(A)); // Copy of A
    let steps = [];

    for (let i = 0; i < n; i++) {
        L[i][i] = 1; // Set diagonal of L to 1

        // Calculate diagonal entries for D
        D[i][i] = U[i][i];
        steps.push(`Setting D[${i+1}][${i+1}] = ${U[i][i]}`);

        for (let j = i + 1; j < n; j++) {
            // Calculate the factor for row elimination in fraction form
            let factorNumerator = U[j][i];
            let factorDenominator = U[i][i];
            let factorFraction = `${factorNumerator} / ${factorDenominator}`;
            L[j][i] = factorNumerator / factorDenominator;

            steps.push(`Elimination Step: R${j+1} = R${j+1} - (${factorFraction}) * R${i+1}`);
            steps.push(`Updating L[${j+1}][${i+1}] = ${factorFraction}`);

            // Update row j in matrix U
            for (let k = i; k < n; k++) {
                U[j][k] -= (factorNumerator / factorDenominator) * U[i][k];
            }
            steps.push(`Matrix after applying E_${i+1}${j+1}:\n` + formatMatrix(U));
        }
    }

    return { L, D, U, steps };
}

// Function to display calculation steps
function displaySteps(steps) {
    const stepsOutput = document.getElementById('steps-output');
    stepsOutput.innerHTML = '<h3>Calculation Steps:</h3>';
    steps.forEach(step => {
        stepsOutput.innerHTML += `<p>${step}</p>`;
    });
}

// Function to display matrices L, D, and U
function displayMatrices(L, D, U) {
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear previous output

    output.innerHTML += '<h3>Matrix L:</h3>' + formatMatrix(L);
    output.innerHTML += '<h3>Matrix D:</h3>' + formatMatrix(D);
    output.innerHTML += '<h3>Matrix U:</h3>' + formatMatrix(U);
}

// Function to format a matrix as HTML
function formatMatrix(matrix) {
    let html = '<div class="matrix">';
    matrix.forEach(row => {
        html += '<div>';
        row.forEach(value => {
            html += `<span>${value.toFixed(2)}</span> `;
        });
        html += '</div>';
    });
    html += '</div>';
    return html;
}
