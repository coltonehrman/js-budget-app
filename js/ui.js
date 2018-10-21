const UIController = (function() {

    const $ = DOM = {
        month:              document.getElementsByClassName('budget__title--month').item(0),
        budget:             document.getElementsByClassName('budget__value').item(0),
        totalIncome:        document.getElementsByClassName('budget__income--value').item(0),
        totalExpense:       document.getElementsByClassName('budget__expenses--value').item(0),
        expensePercentage:  document.getElementsByClassName('budget__expenses--percentage').item(0),
        addType:            document.getElementsByClassName('add__type').item(0),
        addDescription:     document.getElementsByClassName('add__description').item(0),
        addValue:           document.getElementsByClassName('add__value').item(0),
        addButton:          document.getElementsByClassName('add__btn').item(0),
        incomeList:         document.getElementsByClassName('income__list').item(0),
        expenseList:        document.getElementsByClassName('expenses__list').item(0),
        EXPENSE_PERCENTAGE: 'item__percentage',
        DELETE_ICON:        'ion-ios-close-outline'
    };

    function currencyFormat(number) {
        let [ integer, decimal ] = number.toFixed(2).toString().split('.');
        let prettyInteger = '';

        integer.split('').reverse().forEach((int, index) => {
            position = (index % 3);
            prettyInteger += (index !== 0 && position === 0) ? ',' + int : int;
        });

        return '$' + prettyInteger.split('').reverse().join('') + '.' + decimal;
    }

    function createHTML(item) {
        let html = `
            <div class="item clearfix" id="${item.type}-${item.id}">
                <div class="item__description">${item.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${item.type === 'income' ? '+' : '-'} ${currencyFormat(item.value)}</div>`;

        if (item.type === 'expense') {
            html += `<div class="item__percentage">${item.percentage()}%</div>`
        }

        html += `<div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;

        return html;
    }

    function addListItem(item) {
        if (item.type === 'income') {
            $.incomeList.insertAdjacentHTML('beforeend', createHTML(item));
        } else if (item.type === 'expense') {
            $.expenseList.insertAdjacentHTML('beforeend', createHTML(item));
        }
    }

    function removeListItem($item) {
        $item.parentNode.removeChild($item);
    }

    function updateDate() {
        const months = [ 
            'January',
            'Feburary',
            'March',
            'April', 
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        const today = new Date();

        $.month.innerHTML = months[today.getMonth()] + ' ' + today.getFullYear();
    }

    function updateBudget(budget) {
        updateTotal(budget.budget);
        updateTotals(budget.totalIncome, budget.totalExpense);
        updateExpensePercentage(budget.expensePercentage);
    }

    function updateTotal(total) {
        $.budget.innerHTML = `${total < 0 ? '-' : '+'} ${currencyFormat(Math.abs(total))}`;
    }

    function updateTotals(income, expense) {
        $.totalIncome.innerHTML = `+ ${currencyFormat(income)}`;
        $.totalExpense.innerHTML = `- ${currencyFormat(expense)}`;
    }

    function updateExpensePercentage(percentage) {
        $.expensePercentage.innerHTML = `${percentage}%`;
    }

    function updateExpensePercentages(expenses) {
        Array.prototype.forEach.call($.expenseList.children, ($expense, i) => {
            $expense.getElementsByClassName($.EXPENSE_PERCENTAGE).item(0)
                .innerHTML = `${expenses[i].percentage()}%`;
        });
    }

    function toggleAddType() {
        $.addType.classList.toggle('red-focus');
        $.addDescription.classList.toggle('red-focus');
        $.addValue.classList.toggle('red-focus');
        $.addButton.classList.toggle('red');
    }

    function getInput() {
        return {
            type: $.addType.value,
            description: $.addDescription.value.trim(),
            value: $.addValue.value.trim()
        };
    }

    function clearInput() {
        $.addDescription.value = $.addValue.value = '';
        $.addDescription.focus();
    }

    function getDOM() {
        return DOM;
    }

    function isEnterKey(event) {
        return (event.code === 'Enter' || event.charCode === 13 || event.keyCode === 13 || event.which === 13);
    }

    return {
        addListItem,
        removeListItem,
        updateDate,
        updateBudget,
        updateExpensePercentages,
        toggleAddType,
        getInput,
        clearInput,
        getDOM,
        isEnterKey
    };

})();