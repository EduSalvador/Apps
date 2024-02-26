document.addEventListener('DOMContentLoaded', function () {
    let currentInput = "";
    let operation = null;
    let previousInput = "";
    let expression = "";

    const display = document.querySelector('.content-result p');

    // Função auxiliar para formatar números com pontos a cada três dígitos
    const formatNumber = (num) => {
        // Primeiro, garantir que estamos trabalhando com uma string
        let numParts = num.toString().split(",");
        numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return numParts.join(",");
    };

    // Modificada para usar a função de formatação
    const updateDisplay = (value) => {
        let formattedValue = value.toString().replace('.', ',');
        // Aplica formatação apenas para números, evitando operadores
        if (!isNaN(value.replace(',', '.'))) {
            formattedValue = formatNumber(value);
        }
        display.textContent = formattedValue;
    };

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const { id, textContent } = this;
    
            if (id === 'ac') {
                // Reset everything
                currentInput = "";
                previousInput = "";
                operation = null;
                expression = "";
                updateDisplay("0");
            } else if (id === 'percent') {
                // Handle percent
                currentInput = String(parseFloat(currentInput.replace(',', '.')) / 100);
                expression = currentInput;
                updateDisplay(expression);
            } else if (['division', 'multiplication', 'subtraction', 'sum'].includes(id)) {
                if (currentInput !== "" || (currentInput === "" && previousInput !== "" && !operation)) {
                    if (operation) {
                        // Calculate and update previousInput with the result
                        previousInput = evaluate(previousInput, currentInput, operation);
                        currentInput = "";
                    } else if (currentInput !== "") {
                        previousInput = currentInput;
                        currentInput = "";
                    }
                    operation = textContent;
                    expression = previousInput + " " + operation + " ";
                    updateDisplay(expression);
                }
            } else if (id === 'equal') {
                // Calculate the result
                if (previousInput !== "" && currentInput !== "" && operation) {
                    currentInput = String(evaluate(previousInput, currentInput, operation));
                    updateDisplay(currentInput);
                    // Use the result as previousInput for the next operation
                    previousInput = currentInput;
                    currentInput = "";
                    operation = null;
                    expression = "";
                }
            } else {
                // Handle number and comma input
                if (id === 'comma') {
                    if (!currentInput.includes(',')) {
                        currentInput += currentInput === "" ? "0," : ",";
                    }
                } else {
                    currentInput += textContent;
                }
                expression += textContent;
                updateDisplay(expression);
            }
        });
    });

    const evaluate = (num1, num2, operation) => {
        let n1 = parseFloat(num1.replace(',', '.'));
        let n2 = parseFloat(num2.replace(',', '.'));
        switch (operation) {
            case '+':
                return n1 + n2;
            case '-':
                return n1 - n2;
            case '×':
                return n1 * n2;
            case '÷':
                if (n2 === 0) {
                    alert("Não é possível dividir por zero.");
                    return num1;
                }
                return n1 / n2;
            default:
                return n2;
        }
    };

    // Seleciona todos os botões
    const buttonsEffect = document.querySelectorAll('.btn-calc, .btn-calc-number');

    // Adiciona um ouvinte de evento a cada botão
    buttonsEffect.forEach(button => {
        button.addEventListener('mousedown', function() {
            // Adiciona a classe para mudar a cor de fundo
            this.classList.add('button-click-effect');
        });

        button.addEventListener('mouseup', function() {
            // Remove a classe depois de um breve período
            setTimeout(() => {
                this.classList.remove('button-click-effect');
            }, 150); // Ajuste esse tempo conforme necessário
        });
    });
});
