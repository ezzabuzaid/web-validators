const formControlSelector = 'form-control';
const formGroupSelector = 'form-group';

const validators = {
    required() {
        return (value) => value !== ''
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

class FormGroup extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() { }

    get controls() {
        return Array.from(this.querySelectorAll(formControlSelector));
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

    get(name) {
        return this.controls.find(control => control.name === name);
    }

}
class FormControl extends HTMLElement {
    // TODO: check if there's no input element
    constructor() {
        super();
        this.validators = [];
        this.name = null;
    }

    static get observedAttributes() {
        return ['name'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'name':
                this.name = newValue;
                break;

            default:
                break;
        }
    }

    get value() {
        return this.querySelector('input').value;
    }

    get valid() {
        return this.validators.every(validator => validator(this.value));
    }

    get errors() {
        return this.validators.reduce((acc, validator) => {
            acc[validator.name] = validator.check(this.value);
            return acc;
        }, {});
    }
}

window.customElements.define(formControlSelector, FormControl);
window.customElements.define(formGroupSelector, FormGroup);

// const nameControl = new FormControl('value', [
//     // validators.maxlength(5),
//     // validators.minlength(4),
//     // validators.pattern(/^[\w\s\u0621-\u064A]+$/),
//     validators.required(),
// ]);
