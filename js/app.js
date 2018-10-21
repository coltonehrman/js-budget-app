const App = (function(Budget, UI) {

    function typeInputChanged() {
        UI.toggleAddType();
    }

    function addButtonClicked() {
        const input = UI.getInput();

        if (input.description === '' || input.value === '' || isNaN(input.value) || input.value <= 0) return;

        UI.addListItem(Budget.addItem(input.type, input.description, input.value));
        UI.clearInput();
        update();
    }

    function deleteButtonClicked(type, $listItem) {
        const id = parseInt($listItem.id.split('-')[1]);
        Budget.deleteItem(type, id);
        UI.removeListItem($listItem);
        update();
    }

    function update() {
        UI.updateBudget(Budget.calculateBudget());
        UI.updateExpensePercentages(Budget.getExpenses());
    }

    function reset() {
        Budget.reset();
        UI.updateDate();
        UI.updateBudget(Budget.calculateBudget());
        UI.clearInput();
    }

    function setupEventListeners($) {

        function handleListClick(type, event) {
            if (event.target.className === $.DELETE_ICON) {
                const $listItem = event.target.parentNode.parentNode.parentNode.parentNode;
                deleteButtonClicked(type, $listItem);
            };
        }

        document.addEventListener('keypress', function(event) {
            if (UI.isEnterKey(event)) addButtonClicked();
        });
    
        $.addType.addEventListener('change', typeInputChanged);
        $.addButton.addEventListener('click', addButtonClicked);
        $.incomeList.addEventListener('click', handleListClick.bind(null, 'income'));
        $.expenseList.addEventListener('click', handleListClick.bind(null, 'expense'));
    }

    return {
        init: function() {
            reset();
            setupEventListeners(UI.getDOM());
        }
    }

})(BudgetController, UIController);

App.init();