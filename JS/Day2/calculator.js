// 초기세팅
let isPowerOn = true;
let expression = "";
const display = document.querySelector("#display");


// On Off
function togglePower() {
    isPowerOn = !isPowerOn;

    if (isPowerOn) {
        expression = "";
        display.value = "0";
    } else {
        expression = "";
        display.value = "";
    }
}
// 숫자, 소수점
function appendNumber(value) {
    if (!isPowerOn) {
        return;
    }
    if (value ===".") {
        const currentNumber = getCurrentNumber();
        
        if (currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "") {
            expression += "0";
        }
    }

    expression += value;
    display.value = expression;
}
// 연산자
function appendOperator(operator) {
    if (!isPowerOn) {
        return;
    }
    if (expression===""){
        return;
    }
    const lastCharacter = expression.at(-1);
    
    if (isOperator(lastCharacter)) {
        expression = expression.slice(0,-1) + operator;
    } else {
        expression += operator;
    }
    display.value = expression;
}
// 화면 초기화
function clearDisplay() {
    if (!isPowerOn) {
        return;
    }
    expression = "";
    display.value = "0";
}
// 계산
function performCalculate() {
    if (!isPowerOn) {
        return;
    }
    if (expression===""){
        return;
    }
    const lastCharacter = expression.at(-1);
    if (isOperator(lastCharacter)) {
        display.value = "wrong formula";
        expression = "";
        return;
    } 
    const calculateResult = calculate(expression);
    display.value = calculateResult;
    
    if (typeof calculateResult === "number") {
        expression = String(calculateResult);
    } else {
        expression = "";
    }
}
// 입력중인 숫자가져오기
function getCurrentNumber() {
    const numbers = expression.split(/[+\-*/]/);
    return numbers[numbers.length -1];
}
// 연산자인지 확인
function isOperator(value) {
    return (
        value === "+" ||
        value === "-" ||
        value === "*" ||
        value === "/"
    );
}
// 덧셈 함수
function add(a, b) {
    return a + b;
}
// 뺄셈 함수
function subtract(a, b) {
    return a - b;
}
// 곱셈 함수
function multiply(a, b) {
    return a * b;
}
// 나눗셈 함수
function divide(a, b) {
    return a / b;
}
// 계산식 처리 함수
function calculate(formula) {
    // "12+3*4"를 ["12", "+", "3", "*", "4"]로 분리
    const tokens = formula.match(/\d+(?:\.\d+)?|[+\-*/]/g);
    if (!tokens || tokens.length < 3 || tokens.length % 2 === 0) {
        return "잘못된 계산식";
    }
    // 곱셈과 나눗셈 먼저 계산
    const intermediateTokens = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "*" || token === "/") {
            const left = Number(intermediateTokens.pop());
            const right = Number(tokens[i + 1]);
            if (Number.isNaN(left) || Number.isNaN(right)) {
                return "잘못된 숫자";
            }
            if (token === "/" && right === 0) {
                return "0으로 나눌 수 없음";
            }
            let result;
            if (token === "*") {
                result = multiply(left, right);
            } else {
                result = divide(left, right);
            }
            intermediateTokens.push(result);
            i += 2;
        } 
        else {
            intermediateTokens.push(token);
            i++;
        }
    }
    // 덧셈과 뺄셈 계산
    let result = Number(intermediateTokens[0]);

    for (let j = 1; j < intermediateTokens.length; j += 2) {
        const operator = intermediateTokens[j];
        const nextNumber = Number(intermediateTokens[j + 1]);
        if (operator === "+") {
            result = add(result, nextNumber);
        } else if (operator === "-") {
            result = subtract(result, nextNumber);
        }
    }
    return result;
}