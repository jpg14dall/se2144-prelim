const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const hiButton = document.querySelector('[data-hi]')
const byeButton = document.querySelector('[data-bye]')

// State for the calculator
let previousOperand = ''
let currentOperand = ''
let operation = undefined
let isOff = false

// DOM elements
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

// clears the calculator (also turns it on)
function clear() {
    isOff = false
    currentOperand = ''
    previousOperand = ''
    operation = undefined
    updateDisplay()
}

// Function to delete the last number in the current operand
function deleteNumber() {
    if (isOff) return
    currentOperand = currentOperand.toString().slice(0, -1)
}

// Function to append a number to the current operand
function appendNumber(number) {
    if (isOff) return
    const plainNumber = currentOperand.toString().replace(/,/g, '')
    if (plainNumber.length >= 14 && number !== '.') return
    if (number === '.' && currentOperand.includes('.')) return
    currentOperand = currentOperand.toString() + number.toString()
}

// Function to choose an operation (e.g., +, -, ÷, ×)
function chooseOperation(selectedOperation) {
    if (isOff) return
    if (currentOperand === '' && previousOperand === '') return
    if (previousOperand !== '' && currentOperand !== '') {
        compute()
    }

    operation = selectedOperation

    if (currentOperand !== '' && previousOperand === '') {
        previousOperand = currentOperand
        currentOperand = ''
    }
}

// Function to compute the result of the selected operation
function compute() {
    if (isOff) return
    let computation
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)

    // if (operation === '÷' && current === 0) {
    //     currentOperand = 'Error'
    //     operation = undefined
    //     previousOperand = ''
    //     return
    // }

    if (isNaN(prev) || isNaN(current)) return
    switch (operation) {
        case '+':
            computation = prev + current;
            break
        case '-':
            computation = prev - current;
            break
        case '×':
            computation = prev * current;
            break
        case '÷':
            computation = prev / current;
            break
        default:
            return
    }

    const resultString = computation.toString();
    if (resultString.replace(/,/g, '').length > 14) {
        currentOperand = computation.toExponential(6)
    } else {
        currentOperand = Math.round(computation * 100000000000) / 100000000000
    }

    operation = undefined
    previousOperand = ''
}

// Function to format and display the numbers on the calculator screen
function getDisplayNumber(number) {
    if (isOff) return currentOperand
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
        integerDisplay = ''
    } else {
        integerDisplay = integerDigits.toLocaleString('en', {
            maximumFractionDigits: 0,
        })
    }

    const plainNumber = `${integerDigits}${decimalDigits ? '.' + decimalDigits : ''}`

    if (decimalDigits != null) {
        const displayNumber = `${integerDisplay}.${decimalDigits}`
        return plainNumber.length > 14 ? displayNumber.slice(0, 14) : displayNumber
    } else {
        return plainNumber.length > 14 ? integerDisplay.slice(0, 14) : integerDisplay
    }
}

// Function to update the display with the current and previous operands
function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand)
    if (operation != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operation}`
    } else {
        previousOperandTextElement.innerText = ''
    }
}

// Function to turn off the calculator and display "Goodbye"
function toggleOff() {
    if (isOff) return; 
    isOff = true; 
    currentOperand = 'Goodbye'; 
    updateDisplay(); 
    
    
    setTimeout(() => {
        currentOperand = ''; 
        previousOperand = '';
        operation = undefined;
        updateDisplay();
    }, 2000);
}

// Function to display a random greeting
function giveGreeting() {
    if (isOff) return
    const greetings = ['Hello', 'Hola', 'Kamusta', 'Bonjour', 'Ciao', 'Hallo', 'Olá']
    let randomGreeting = Math.floor(Math.random() * greetings.length)
    previousOperand = ''
    currentOperandTextElement.innerText = greetings[randomGreeting]
}


hiButton.addEventListener('click', giveGreeting)

byeButton.addEventListener('click', toggleOff)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.innerText)
        updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.innerText)
        updateDisplay()
    })
})

equalsButton.addEventListener('click', () => {
    compute()
    updateDisplay()
});

allClearButton.addEventListener('click', () => {
    clear()
    updateDisplay()
})

deleteButton.addEventListener('click', () => {
    deleteNumber()
    updateDisplay()
})
