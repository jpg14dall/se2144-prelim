// State for the calculator
let previousOperand = '';
let currentOperand = '';
let operation = undefined;
let isOff = false;

// DOM elements
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// Function to clear the calculator (also turns it on)
function clear() {
    isOff = false;
    currentOperand = '';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// Function to delete the last number in the current operand
function deleteNumber() {
    if (isOff) return;
    currentOperand = currentOperand.toString().slice(0, -1);
}

// Function to append a number to the current operand
function appendNumber(number) {
    if (isOff) return;
    const plainNumber = currentOperand.toString().replace(/,/g, '');
    if (plainNumber.length >= 14 && number !== '.') return;
    if (number === '.' && currentOperand.includes('.')) return;
    currentOperand = currentOperand.toString() + number.toString();
}

// Function to choose an operation (e.g., +, -, ÷, ×)
function chooseOperation(selectedOperation) {
    if (isOff) return;
    if (currentOperand === '' && previousOperand === '') return;
    if (previousOperand !== '' && currentOperand !== '') {
        compute();
    }

    operation = selectedOperation;

    if (currentOperand !== '' && previousOperand === '') {
        previousOperand = currentOperand;
        currentOperand = '';
    }
}

// Function to compute the result of the selected operation
function compute() {
    if (isOff) return;
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (operation === '÷' && current === 0) {
        currentOperand = 'Error';
        operation = undefined;
        previousOperand = '';
        return;
    }

    if (isNaN(prev) || isNaN(current)) return;
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            computation = prev / current;
            break;
        default:
            return;
    }

    const resultString = computation.toString();
    if (resultString.replace(/,/g, '').length > 14) {
        currentOperand = computation.toExponential(6);
    } else {
        currentOperand = Math.round(computation * 100000000000) / 100000000000;
    }

    operation = undefined;
    previousOperand = '';
}

// Function to format and display the numbers on the calculator screen
function getDisplayNumber(number) {
    if (isOff) return currentOperand;
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', {
            maximumFractionDigits: 0,
        });
    }

    const plainNumber = `${integerDigits}${decimalDigits ? '.' + decimalDigits : ''}`;

    if (decimalDigits != null) {
        const displayNumber = `${integerDisplay}.${decimalDigits}`;
        return plainNumber.length > 14 ? displayNumber.slice(0, 14) : displayNumber;
    } else {
        return plainNumber.length > 14 ? integerDisplay.slice(0, 14) : integerDisplay;
    }
}

// Function to update the display with the current and previous operands
function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    if (operation != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
}

// Function to turn off the calculator and display "Goodbye"
function toggleOff() {
    if (isOff) return;
    isOff = true;
    currentOperand = 'Goodbye';
    previousOperand = '';
    updateDisplay();
}

// Function to display a random greeting
function giveGreeting() {
    const greetings = ['Hello', 'Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo', 'Olá'];
    if (isOff) return;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    currentOperand = randomGreeting;
    previousOperand = '';
    updateDisplay();
}

// Event listeners for buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const hiButton = document.querySelector('[data-hi]');
const byeButton = document.querySelector('[data-bye]');

// Event listener for "Hi" button
hiButton.addEventListener('click', giveGreeting);

// Event listener for "Bye" button
byeButton.addEventListener('click', toggleOff);

// Event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.innerText);
        updateDisplay();
    });
});

// Event listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.innerText);
        updateDisplay();
    });
});

// Event listener for equals button
equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

// Event listener for all-clear button
allClearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

// Event listener for delete button
deleteButton.addEventListener('click', () => {
    deleteNumber();
    updateDisplay();
});
