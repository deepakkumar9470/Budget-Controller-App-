let budgetController = (function () {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {

    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, value) {
            let newItem, ID;
            //creating new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, value);
            }
            //push into our data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            let ids, index;
            //data.allItems[type][id];
            ids = data.allItems[type].map(function (current) {
                return current.id;

            });
            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },


        calculateBugget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentage: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentage: function () {
            let allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    };

})();


let UIController = (function () {
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    let formatNumber = function (num, type) {
        let numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); //input 23510, output 23,510
        }


        dec = numSplit[1];
        //type === 'exp' ? sign = '-' : sign = '+';
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            let html, newHtml, incomeContainer;
            if (type === 'inc') {
                html = '<div class="item clearfix" id="inc-%id%"> \
                <div class="item__description">%description%</div> \
                <div class="right clearfix"> \
                <div class="item__value">%value%</div> \
                <div class="item__delete"> \
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
                </div> \
                </div> \
                </div>';
            } else if (type === 'exp') {
                html = '<div class="item clearfix" id="exp-%id%"> \
                <div class="item__description">%description%</div> \
               <div class="right clearfix"> \
               <div class="item__value">%value%</div> \
               <div class="item__percentage">21%</div> \
               <div class="item__delete"> \
               <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> \
               </div> \
               </div> \
               </div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%descrition%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function (selectorID) {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            let fields;
            fields = document.querySelectorAll(DOMStrings.inputType + ' ,' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";

            });
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '___';
            }
        },

        displayPercentage: function (percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '___';
                }

            });
        },

        displayMonth: function () {
            let now, month, months, year;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        chagedType: function () {
            let fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.incomeBtn).classList.toggle('red');

        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {
    let setUpEventListner = function () {
        let DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (eventkeyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
        document.querySelector(DOM.controller).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };


    let updateBudget = function () {
        budgetCtrl.calculateBugget();
        let budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function () {
        budgetCtrl.calculatePercentage();
        let percentages = budgetCtrl.getPercentage();
        UICtrl.displayPercentage(percentages);

    };


    // let DOM = UICtrl.getDOMStrings();
    let ctrlAddItem = function () {
        let input, newItem;
        input = UICtrl.getInput();
        if (input.description !== "" && !NaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;
        itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListner();
        }
    }
})(budgetController, UIController);
controller.init();
