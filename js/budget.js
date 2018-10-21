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

    function addItem(type, description, value) {
        const list = data[type + 's'];
        const item = (type === 'income') ?
            new Income(nextID(data.incomes), description, value) :
            new Expense(nextID(data.expenses), description, value);

        list.push(item);
        return item;
    }

    function deleteItem(type, id) {
        data[type + 's'] = data[type + 's'].filter(item => item.id !== id);
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

    function reset() {
        data.expenses = [];
        data.incomes  = [];
    }

    return {
        addItem,
        deleteItem,
        totalIncome,
        totalExpense,
        getExpenses,
        calculateBudget,
        reset
    };

})();