import { FormGroup } from '@angular/forms';

export class MutualRequiredValidator {

    public static validate(firstField, secondField) {

        return (c: FormGroup) => {
            if (c.controls && (c.controls[firstField].value == '' || c.controls[firstField].value == undefined) && (c.controls[secondField].value == '' || c.controls[secondField].value == undefined)) {
                return {
                    mutualRequiredEqual: {
                        valid: false
                    }
                }
            } else {
                return null;
            }
        }
    }
}
