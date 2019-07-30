class FormGroup {
    constructor(element, controls = [], options) {
        this.controls = controls;
    }

    valid() {
        return this.controls.every(control => control.valid);
    }

    value() {
        return this.controls.reduce((acc, control) => {
            acc[control.name] = control.value;
            return acc;
        }, {});
    }

    addControl(control) {
        this.controls.push(control);
    }


}
const validators = {
    required() {
        return {
            check(value) {
                return value !== ''
            },
            name: 'required'
        };
    },
    pattern(regex) {
        return (value) => !regex.test(value);
    },
    minlength(number) {
        return (value) => value.length >= number;
    },
    maxlength(number) {
        return (value) => value.length <= number;
    }

}

class FormControl {
    constructor(id, validators) {
        this.validators = validators;
        this.name = id;
        this._control = document.getElementById(this.name);
    }

    get value() {
        return this._control.value;
    }

    get valid() {
        return this.validators.every(validator => validator.check(this.value));
    }

    get errors() {
        return this.validators.reduce((acc, validator) => {
            acc[validator.name] = validator.check(this.value);
            return acc;
        }, {});
    }
}

const nameControl = new FormControl('value', [
    // validators.maxlength(5),
    // validators.minlength(4),
    validators.required(),
    // validators.pattern(/^[\w\s\u0621-\u064A]+$/),
]);

const formGroup = new FormGroup(document.getElementById('formTest'), {
    name: nameControl
});

