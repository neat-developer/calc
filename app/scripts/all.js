"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var buttonEl =
/*#__PURE__*/
function () {
  function buttonEl(val, el, parent) {
    _classCallCheck(this, buttonEl);

    this.parent = parent;
    this.options = {};
    this.el = el;
    this.options.isNumeric = !isNaN(Number(val, 10));
    this.value = this.options.isNumeric ? Number(val) : val;
    this.el.onclick = this.onClick.bind(this);
  }

  _createClass(buttonEl, [{
    key: "onClick",
    value: function onClick() {
      switch (this.value) {
        case 'DEL':
        case 'C':
          {
            this.parent.clearCalcValues(this.value === "DEL");
          }
          break;

        case 'S':
          {
            this.parent.subscribeToMyChannel();
          }
          break;

        case '/':
        case '*':
        case '-':
        case '+':
          {
            this.parent.operationBySymbol(this.value);
          }
          break;

        case '=':
          {
            this.parent.getResult();
          }
          break;

        case ',':
          {
            this.parent.addDotToValue();
          }
          break;

        default:
          {
            this.parent.addNumericToField(this.value + '');
          }
      }
    }
  }]);

  return buttonEl;
}();

var Calc =
/*#__PURE__*/
function () {
  function Calc(options) {
    _classCallCheck(this, Calc);

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

  _createClass(Calc, [{
    key: "init",
    value: function init() {
      var _this = this;

      if (!this.options.id) {
        console.warn("Calc id is not defined!");
        return false;
      }

      this.buttons = findElementInsideId(this.options.id, 'calculator-buttons')[0].children;
      this.buttons = Array.prototype.slice.call(this.buttons); // {'0': 'DEL', '1': 'C',...} => ['DEL', 'C']

      this.buttons.map(function (btn) {
        return _this.setEventToButton(btn);
      });
      this.addNumericToField(0);
    }
  }, {
    key: "addDotToValue",
    value: function addDotToValue() {
      if (isFloat(Number(this.value))) return false;
      this.addedDot = true;
    }
  }, {
    key: "addNumericToField",
    value: function addNumericToField(value) {
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
    }
  }, {
    key: "operationBySymbol",
    value: function operationBySymbol(symbol) {
      this.symbol = symbol;
      this.fValue = Number(this.value);
      this.value = '';
      this.addedDot = false;
      this.updateHistoryField(this.fValue + ' ' + symbol);
      this.addNumericToField(0);
      this.updateFields();
    }
  }, {
    key: "subscribeToMyChannel",
    value: function subscribeToMyChannel() {
      var calc = '<span class="calculator-subscribe">Hey, subscribe to my <a href="https://www.youtube.com/channel/UCof1QQG3jQcH0DTRdYOGLgg" target="_blank">youtube channel</a>  :)</span>';
      this.elements["calculator-field"].innerHTML = '<span class="calculator-subscribe">I\'ll very happy to see u</span>';
      this.elements["calculator-history"].innerHTML = calc;
    }
  }, {
    key: "getResult",
    value: function getResult() {
      if (!this.fValue) return false;
      var valueToInt = Number(this.value);
      var operations = {
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
  }, {
    key: "updateFields",
    value: function updateFields() {
      this.elements["calculator-field"].innerText = Number(this.value);
    }
  }, {
    key: "updateHistoryField",
    value: function updateHistoryField(value) {
      this.elements["calculator-history"].innerText = value;
    }
  }, {
    key: "clearSymbolAndFValue",
    value: function clearSymbolAndFValue() {
      this.fValue = null;
      this.symbol = null;
    }
  }, {
    key: "clearCalcValues",
    value: function clearCalcValues(latest) {
      if (latest && !this.fValue) {
        var valueStr = '' + Number(this.value);
        this.value = valueStr.length > 1 ? valueStr.slice(0, -1) : 0;
      } else {
        this.value = '' + 0;
        this.clearSymbolAndFValue();
        this.updateHistoryField('');
      }

      this.addedDot = false;
      this.updateFields();
    }
  }, {
    key: "setEventToButton",
    value: function setEventToButton(btn) {
      return new buttonEl(btn.innerText, btn, this);
    }
  }]);

  return Calc;
}();

new Calc({
  id: "calc"
});

function findElementInsideId(id, className) {
  return document.getElementById(id).getElementsByClassName(className);
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}
"use strict";

var VERSION_APP = "1.0.0";
"use strict";