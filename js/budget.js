const BudgetController = (function() {

    const data = {
        incomes: [],
        expenses: []
    };

    function Budget(id, description, value) {
        this.id             = id;
        this.description    = description;
        this.value          = parseFloat(value);
    }

    Budget.prototype.percentage = function() {
        const income        = totalIncome();
        const percentage    = Math.round((this.value / income) * 100);

        return (income <= 0) ?
            100 : percentage;
    };

    function Income(id, description, value) {
        Budget.call(this, id, description, value);
        this.type = 'income';
    }

    Income.prototype = Object.create(Budget.prototype);
    Income.constructor = Income;

    function Expense(id, description, value) {
        Budget.call(this, id, description, value);
        this.type = 'expense';
    }

    Expense.prototype = Object.create(Budget.prototype);
    Expense.constructor = Expense;

    function nextID(data) {
        const lastItem = data[data.length - 1];
        return lastItem ? lastItem.id + 1 : 0;
    }

    function save() {
        localStorage.setItem('data', JSON.stringify(data));
    }

    function addItem(type, description, value) {
        const list = data[type + 's'];
        const item = (type === 'income') ?
            new Income(nextID(data.incomes), description, value) :
            new Expense(nextID(data.expenses), description, value);

        list.push(item);
        save();
        return item;
    }

    function deleteItem(type, id) {
        data[type + 's'] = data[type + 's'].filter(item => item.id !== id);
        save();
    }

    function calculateTotal(type) {
        return data[type].reduce((total, item) => (
            total + item.value
        ), 0);
    }

    const totalIncome  = calculateTotal.bind(null, 'incomes');
    const totalExpense = calculateTotal.bind(null, 'expenses');

    function getExpenses() {
        return data.expenses;
    }

    function calculateBudget() {
        const income = totalIncome();
        const expense = totalExpense();
        let expensePercentage = (income <= 0) ?
            100 : Math.round((expense / income) * 100);

        return {
            budget: income - expense,
            totalIncome: income,
            totalExpense: expense,
            expensePercentage
        }
    }

    function init() {
        if (localStorage) {
            if (localStorage.getItem('data')) {
                const { incomes, expenses } = JSON.parse(localStorage.getItem('data'));
                data.incomes = incomes.map(income => new Income(income.id, income.description, income.value));
                data.expenses = expenses.map(expense => new Expense(expense.id, expense.description, expense.value));
            } else {
                save();
            }
        }

        return data;
    }

    return {
        addItem,
        deleteItem,
        totalIncome,
        totalExpense,
        getExpenses,
        calculateBudget,
        init
    };

})();