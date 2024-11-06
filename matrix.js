function generateMatrixInput() {
  const matrixSize = document.getElementById('matrix-size').value;
  const matrixInputs = document.getElementById('matrix-inputs');
  matrixInputs.innerHTML = ''; // Clear previous inputs

  for (let i = 0; i < matrixSize; i++) {
      let row = document.createElement('div');
      row.classList.add('matrix');
      for (let j = 0; j < matrixSize; j++) {
          let input = document.createElement('input');
          input.type = 'number';
          input.id = `cell-${i}-${j}`;
          input.placeholder = `A[${i+1}][${j+1}]`;
          row.appendChild(input);
      }
      matrixInputs.appendChild(row);
  }
}

function calculateLDU() {
  const matrixSize = parseInt(document.getElementById('matrix-size').value);
  const matrix = [];

  // Retrieve matrix values from input
  for (let i = 0; i < matrixSize; i++) {
      let row = [];
      for (let j = 0; j < matrixSize; j++) {
          const cellValue = document.getElementById(`cell-${i}-${j}`).value;
          row.push(parseFloat(cellValue));
      }
      matrix.push(row);
  }

  const { L, D, U, steps } = LDUFactorization(matrix, matrixSize);
  displaySteps(steps);
  displayMatrices(L, D, U);
}

function LDUFactorization(A, n) {
  let L = Array.from({ length: n }, () => Array(n).fill(0));
  let D = Array.from({ length: n }, () => Array(n).fill(0));
  let U = JSON.parse(JSON.stringify(A)); // Copy of A
  let steps = [];

  for (let i = 0; i < n; i++) {
      L[i][i] = 1; // Set diagonal of L to 1

      // Calculate diagonal entries for D
      D[i][i] = U[i][i];
      steps.push(`Setting D[${i}][${i}] = ${U[i][i]}`);
      
      for (let j = i + 1; j < n; j++) {
          // Calculate the factor for row elimination
          let factor = U[j][i] / U[i][i];
          L[j][i] = factor;
          steps.push(`Elimination Step: R${j+1} = R${j+1} - (${factor.toFixed(2)}) * R${i+1}`);
          steps.push(`Updating L[${j}][${i}] = ${factor.toFixed(2)}`);

          // Update row j in matrix U
          for (let k = i; k < n; k++) {
              U[j][k] -= factor * U[i][k];
          }
          steps.push(`Matrix after applying E_${i+1}${j+1}:\n` + formatMatrix(U));
      }
  }

  return { L, D, U, steps };
}

function displaySteps(steps) {
  const stepsOutput = document.getElementById('steps-output');
  stepsOutput.innerHTML = '<h3>Calculation Steps:</h3>';
  steps.forEach(step => {
      stepsOutput.innerHTML += `<p>${step}</p>`;
  });
}

function displayMatrices(L, D, U) {
  const output = document.getElementById('output');
  output.innerHTML = ''; // Clear previous output

  output.innerHTML += '<h3>Matrix L:</h3>' + formatMatrix(L);
  output.innerHTML += '<h3>Matrix D:</h3>' + formatMatrix(D);
  output.innerHTML += '<h3>Matrix U:</h3>' + formatMatrix(U);
}

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
