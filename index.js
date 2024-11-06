let steps = document.querySelectorAll('.matrix-step');
let currentStep = 0;

function showStep(step) {
    if (step < steps.length) {
        steps[step].classList.add('show');

        setTimeout(() => {
            steps[step].classList.remove('show');
            let nextStep = (step + 1) % steps.length;
            showStep(nextStep); 
        }, 2000);
    }
}

showStep(currentStep);