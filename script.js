const calculator = document.querySelector('.cal_wrapper');
const display = document.querySelector('.cal_display');
const buttons = document.querySelector('.buttons_wrapper');
const operators = document.querySelectorAll('.operator');
const calObject = {
    firstValue: '',
    operator: '',
    previousButtonType: '',
    modifiedValue: ''
}

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

function operate(operator, num1, num2) {
    const firstNum = parseFloat(num1);
    const secondNum = parseFloat(num2);
    switch(operator){
        case 'add':
            return add(firstNum, secondNum);
        case 'subtract':
            return subtract(firstNum, secondNum);
        case 'multiply':
            return multiply(firstNum,secondNum);
        case 'divide':
            return divide(firstNum,secondNum);
    }
}

const getButtonType = button => {
    const action = button.dataset.action;
    if(!action){return 'number';}
    if(
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {return 'operator';}
    return action;
}

const resetCalObject = object => {
    Object.keys(object).forEach(function(key, index) {
        calObject[key] = '';
    });
}

const displayResult = (button, displayedNum, calObject) => {
    const buttonContent = button.textContent;
    const buttonType = getButtonType(button);
    const previousButtonType = calObject.previousButtonType;
    let firstValue = calObject.firstValue;
    const operator = calObject.operator;
    let secondValue = displayedNum;
    
    if(buttonType === 'number'){
        if(buttonContent === '0' && operator === 'divide'){
            alert('Nice try! We don\'t divide by zero here.');
            resetCalObject(calObject);
        }
        return (displayedNum === '0' || previousButtonType === 'operator' || previousButtonType === 'calculate')
            ? buttonContent
            : displayedNum + buttonContent
        
    }

    if(buttonType === 'decimal'){
        if(!displayedNum.includes('.') && previousButtonType !== 'operator' && previousButtonType !== 'calculate') {
            return displayedNum + '.';
        } 
        if(previousButtonType === 'operator' || previousButtonType === 'calculate'){
            return '0.';
        }
        return displayedNum;
    }

    if(buttonType === 'operator'){
        return (firstValue && operator && previousButtonType !== 'operator' && previousButtonType !== 'calculate')
            ? operate(operator, firstValue, secondValue)
            : displayedNum
    }

    if(buttonType === 'clear'){
        return '0';
    }

    if(buttonType === 'backspace' && (previousButtonType === 'number' || previousButtonType === 'backspace')){
        while(displayedNum.toString().length > 1) {
            return displayedNum.slice(0, -1);
        }
        return '0';
    }

    if(buttonType === 'calculate'){        
        if(firstValue){
            if(previousButtonType === 'calculate'){
                firstValue = displayedNum;
                secondValue = calObject.modifiedValue;
                return operate(operator, firstValue, secondValue);
            }
            return operate(operator, firstValue, displayedNum);
        }
        return displayedNum;
    }
}

const updateCalObject = (button, calObject, displayedNum) => {
    const buttonType = getButtonType(button);
    const previousButtonType = calObject.previousButtonType;
    const modifiedValue = calObject.modifiedValue;

    if(buttonType === 'number'){
        if(previousButtonType === 'calculate'){
            resetCalObject(calObject);
        }
    }  

    if(buttonType === 'operator') {
        calObject.operator = button.dataset.action;
        calObject.firstValue = display.textContent;
    } 

    if(buttonType === 'decimal'){
        if(previousButtonType === 'calculate'){
            resetCalObject(calObject);
        }
    } 

    if(buttonType === 'clear' && button.textContent === 'AC'){
        resetCalObject(calObject);
    } 

    if(buttonType === 'calculate'){
        let firstValue = calObject.firstValue;
        if(firstValue){
            if(previousButtonType === 'calculate'){
            calObject.modifiedValue = modifiedValue; 
            } else {
                calObject.modifiedValue = displayedNum;
            }
        }
    }
} 

const updateVisualState = (button, calculator) => {
    const buttonType = getButtonType(button);
    //Remove .is-clicked class from all buttons
    Array.from(button.parentNode.children).forEach(
        button => button.classList.remove('is_clicked'));

    if(buttonType === 'operator') {
        button.classList.add('is_clicked');
    } 
    if(buttonType === 'clear' && button.textContent !== 'AC'){
            button.textContent = 'AC';
    }
    if(buttonType !== 'clear'){
        const clearButton = calculator.querySelector('.clear');
        clearButton.textContent = 'CE';
    }
}

const roundResult = (resultString) => {
    return (resultString.toString().length > 15)
    ? (parseFloat(resultString.toString().substring(0, 15)))
    : resultString
}

buttons.addEventListener('click', event => {
    if(event.target.matches('button')){
        const button = event.target;
        const displayedNum = display.textContent;
        const buttonType = getButtonType(button);
        const resultString = displayResult(button, displayedNum, calObject);
        
        display.textContent = roundResult(resultString);
        updateCalObject(button, calObject, displayedNum);
        updateVisualState(button, calculator);
        calObject.previousButtonType = buttonType;
        
        console.log(calObject);
    }
})

document.addEventListener('keydown', function(event){
    console.log(event);
    let key;
    if (event.key === 'Enter'){
        key = document.querySelector('.equals');
    } else if(event.key === '/'){
        key = document.querySelector('button[data-key="÷"]')
    } else if(event.key === 'Escape' || event.key === 'A'){
        key = document.querySelector('.clear');
    } else {
        key = document.querySelector(`button[data-key='${event.key}']`);
    }
    key.click();
});