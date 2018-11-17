class buttonEl {
    constructor(val, el, parent) {
        this.parent = parent;
        this.options = {};
        this.el = el;
        this.options.isNumeric = !isNaN(Number(val, 10));
        this.value = this.options.isNumeric ? Number(val) : val;
        this.el.onclick = this.onClick.bind(this);
    }

    addValueToField() {
        this.parent.addNumericToField(this.value);
    }

    onClick() {
        switch (this.value) {
            case 'DEL':
            case 'C': {
                this.parent.clearCalcValues(this.value === "DEL");
            }
                break;
            case '%': {

            }
                break;
            case '/':
            case '*':
            case '-':
            case '+': {
                this.parent.operationBySymbol(this.value)
            }
                break;
            case '=': {
                this.parent.getResult();
            }
                break;
            case ',': {
                this.parent.addDotToValue();
            }
                break;
            default: {
                this.addValueToField();
            }
        }
    }
}


class Calc {
    constructor(options) {
        this.options = options;
        this.fValue = null;
        this.symbol = null;
        this.addedDot = null;

        this.value = '';
        this.elements = {
            'calculator-field': findElementInsideId(this.options.id, 'calculator-field')[0],
            'calculator-history': findElementInsideId(this.options.id, 'calculator-history')[0]
        };
        this.init();
    }

    init() {
        if (!this.options.id) {
            console.warn("Calc id is not defined!");
            return false;
        }
        this.buttons = findElementInsideId(this.options.id, 'calculator-buttons')[0].children;
        this.buttons = Array.prototype.slice.call(this.buttons); // {'0': 'DEL', '1': 'C',...} => ['DEL', 'C']
        this.buttons.map(btn => {
            return this.setEventToButton(btn);
        });
        this.addNumericToField(0);
    }


    addDotToValue() {
        if (isFloat(Number(this.value))) return false;
        this.addedDot = true;
    }

    addNumericToField(value) {
        if (typeof this.value === 'number') {
            this.value = '0';
            this.clearSymbolAndFValue();
        }
        if (this.addedDot && !isFloat(Number(this.value))) {
            this.value += '.' + value;
            this.updateFields();
            return false;
        }
        this.value += value;
        this.updateFields();
    };

    operationBySymbol(symbol) {
        this.symbol = symbol;
        this.fValue = Number(this.value);
        this.value = '';
        this.addedDot = false;

        this.updateHistoryField(this.fValue + ' ' + symbol);
        this.addNumericToField(0);
        this.updateFields();
    }

    getResult() {
        if (!this.fValue) return false;
        let valueToInt = Number(this.value);
        let operations = {
            '*': this.fValue * valueToInt,
            '/': this.fValue / valueToInt,
            '+': this.fValue + valueToInt,
            '-': this.fValue - valueToInt
        };

        this.value = operations[this.symbol] + '';
        this.updateFields();
        this.clearSymbolAndFValue();
        this.updateHistoryField('');
    }

    updateFields() {
        this.elements["calculator-field"].innerText = Number(this.value);
    }

    updateHistoryField(value) {
        this.elements["calculator-history"].innerText = value;
    }

    clearSymbolAndFValue() {
        this.fValue = null;
        this.symbol = null;
    }

    clearCalcValues(latest) {
        if (latest && !this.fValue) {
            let valueStr = ('' + Number(this.value));
            this.value = valueStr.length > 1 ? valueStr.slice(0, -1) : 0;
        } else {
            this.value = '' + 0;
            this.clearSymbolAndFValue();
            this.updateHistoryField('');
        }
        this.addedDot = false;
        this.updateFields();
    }

    setEventToButton(btn) {
        return new buttonEl(btn.innerText, btn, this);
    }
}

new Calc({id: "calc"});

function findElementInsideId(id, className) {
    return document.getElementById(id).getElementsByClassName(className);
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}