const formControlSelector = 'form-control';
const formGroupSelector = 'form-group';

class Validator {
    constructor(name) {
        this.name = name;
    }
}

const validators = {
    required: class Required extends Validator {
        constructor() {
            super('required');
        }
        check(value) {
            return value !== '';
        }
    },
    pattern: class Pattern extends Validator {
        constructor(regex) {
            super('pattern');
            this.regex = regex;
        }
        check(value) {
            return !this.regex.test(value);
        }
    },
    minlength: class MinLength extends Validator {
        constructor(length) {
            super('minlength');
            this.length = +length;
        }
        check(value) {
            return value.length >= this.length;
        }
    },
    maxlength: class MaxLength extends Validator {
        constructor(length) {
            super('maxlength');
            this.length = +length;
        }
        check(value) {
            return value.length <= this.length;
        }
    },
    min: class Min extends Validator {
        constructor(length) {
            super('min');
            this.length = +length;
        }
        check(value) {
            return value >= this.length;
        }
    },
    max: class Max extends Validator {
        constructor(length) {
            super('max');
            this.length = +length;
        }
        check(value) {
            return value <= this.length;
        }
    },
}

class FormGroup extends HTMLElement {

    constructor() {
        super();
        this._controls = []
        this._validators = []
    }

    connectedCallback() { }

    get controls() {
        if (this._controls.length === 0) {
            this._controls = Array.from(this.querySelectorAll(formControlSelector));
        }
        return this._controls;
    }

    get(controlName) {
        return this.controls.find(control => control.name === controlName);
    }

    addControl(control) {
        this.controls.push(control);
    }

    get valid() {
        return this.controls.every(control => control.valid);
    }

    get value() {
        return this.controls.reduce((acc, control) => {
            acc[control.name] = control.value;
            return acc;
        }, {});
    }

    set value(newObject) {
        this.controls.forEach(control => {
            contorl.value = newObject[control.name];
        });
    }

    addValidator(...validators) {
        this.controls.forEach(control => control.addValidator(...validators));
    }

    enable() {
        this.controls.forEach(control => control.enable());
    }

    disable() {
        this.controls.forEach(control => control.disable());
    }

    get errors() {
        return this.controls.reduce((acc, control) => {
            acc[control.name] = control.errors;
            return acc;
        }, {})
    }

}
class FormControl extends HTMLElement {
    constructor() {
        super();
        this.validators = [];
        this._input = null;
    }

    connectedCallback() {
        setTimeout(() => {
            const inputs = this.querySelectorAll('input');
            this._input = inputs[0];
            if (!this._input) {
                throw new Error(`${formControlSelector} should have <input>`);
            }
            if (inputs.length > 1) {
                throw new Error(`${formControlSelector} should contain one <input>`);
            }
            this._populateValidators();
        });
    }

    _populateValidators() {
        for (let validator in validators) {
            const constraint = this._input.attributes[validator];
            if (constraint) {
                this.validators.push(new validators[validator](constraint.value));
                this.setAttribute(constraint.name, constraint.value);
                // this._input.removeAttribute(constraint.name);
            }
        }
    }

    get name() {
        return this.getAttribute('name');
    }

    get value() {
        return this._input.value;
    }

    get valid() {
        return this.validators.every(validator => validator.check(this.value));
    }

    get errors() {
        return this.validators.length < 1
            ? null
            : this.validators.reduce((acc, validator) => {
                acc[validator.name] = !validator.check(this.value);
                return acc;
            }, {});
    }

    addValidator(...newValidators) {
        this.validators.push(...newValidators);
        const getValidatorIndex = (validatorName) => array.findIndex(validator => validator.name === validatorName)
        this.validators.filter((validator, index, array) => getValidatorIndex(validator.name) === index);
    }

    removeValidator(validator) {
        const validatorIndex = this.validators.findIndex(existValidator => existValidator.name === validator.name);
        if (validatorIndex < 0) {
            throw new TypeError('validator is not found');
        }
        this.validators.splice(validatorIndex, 1);
    }

    cleanValidators() {
        this.validators = [];
    }

    enable() {
        this._input.removeAttribute('readonly');
        this._input.removeAttribute('disabled');
    }

    disable() {
        this._input.setAttribute('readonly', true);
        this._input.setAttribute('disabled', true);
    }

}

window.customElements.define(formControlSelector, FormControl);
window.customElements.define(formGroupSelector, FormGroup);


const formGroup = new FormGroup();
formGroup.addValidator(new validators.required());

const formControl = new FormControl();