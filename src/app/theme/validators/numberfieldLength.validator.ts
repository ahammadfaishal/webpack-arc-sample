import { AbstractControl, ValidatorFn } from '@angular/forms';
export function numberMinLength(min: Number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const input = control.value,
            isValid = input && input.toString().length < min;
        if (isValid)
            return { 'numberMinLength': { min } }
        else
            return null;
    };
}
