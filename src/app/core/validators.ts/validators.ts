import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

export const SPACE_REGEXP = /^\S+(?: \S+)*$/;
export const DESC_SPACE_REGEXP = /^[^\s]+(\s+[^\s]+)*$/;
export const FLOAT_REGEXP = /^[0-9]*[.][0-9]+$/;
export const NODECIMAL_REGEXP = /^[a-zA-Z0-9_,-]+$/;
export const URL_REGEX = /(ftp|http|https):\/\/?www\.([A-z0-9]+)\.([A-z]{1,})/;
export const EMAIL_REGEX = /^(?=[a-zA-Z0-9.]{0,20}$)[a-z0-9]+\.?[a-z0-9]+$|^.*@\w+\.[\w.]+$/;
export const MEASUREMENT_REGEX = /^\d+(?:\.\d+)?$/;
export const CALIBRATIONRANGE_REGEX = /^\d+(?:\.\d+[0-9]+)?$/;
export const NUMBER_REGEX = /[+-]?([0-9]*[.])?[0-9]+/;

export function emailValidator(email: AbstractControl): ValidatorFn {
  return (group: FormGroup) => {
    const emailValue = email.value;
    if (email.enabled && email.dirty) {
      if (emailValue.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')) {
        email.setErrors(null);
        return null;
      } else {
        email.setErrors({ emailError: true });
        return null;
      }
    }
  };
}

export function specialCharacterValidator(inputControl: AbstractControl): ValidatorFn {
  const value = inputControl.value;
  if (value !== undefined && value !== null) {
    const isWhitespace = (value).trim().length === 0;
    return (group: AbstractControl) => {
      if (inputControl.enabled && inputControl.dirty) {
        if (isWhitespace) {
          inputControl.setErrors({ spaceValidator: true });
          return null;
        } else {
          inputControl.setErrors(null);
          return null;
        }
      }
    };
  }
}



export function rangeValueCheck(upperRange: AbstractControl, lowerRange: AbstractControl): ValidatorFn {

  return (group: FormGroup) => {
    if ((upperRange.enabled && lowerRange.dirty) || (lowerRange.enabled && lowerRange.dirty)) {
      if ((upperRange.value - lowerRange.value) < 0) {
        lowerRange.setErrors({ rangeError: true });
      } else {
        lowerRange.setErrors(null);
        return null;
      }
      return;
    }
  };
}






export function linValidator(link: string): ValidatorFn {
  return (group: FormGroup) => {
    const linkControl = group.controls[link];
    if (linkControl.value) {
      if (URL_REGEX.test(linkControl.value)) {
        linkControl.setErrors(null);
        return null;
      } else {
        linkControl.setErrors({ inValidLink: true });
      }
    }
  };
}
export function upperRangeAndLowerRange(maxRange: string, minRange: string): ValidatorFn {
  return (group: FormGroup): { [key: string]: boolean } => {
    const lowerRanges = group.controls[minRange];
    const upperRanges = group.controls[maxRange];
    if ((group.controls[maxRange].enabled && group.controls[minRange].enabled) ||
      (group.controls[maxRange].dirty && group.controls[minRange].dirty)) {
      if (Number(lowerRanges.value)) {
        if (upperRanges.value !== undefined && Number(lowerRanges.value) <= Number(upperRanges.value)) {
          lowerRanges.setErrors(null);
          upperRanges.setErrors(null);
          return null;
        } else {
         
          if(upperRanges.value === undefined){
            lowerRanges.setErrors({ rangeError: true });

          }
         else if(Number(lowerRanges.value) > Number(upperRanges.value)){
            lowerRanges.setErrors({ rangeError: true });
          }
          else {
            lowerRanges.setErrors(null);
          }
      

        }
      }

    }
  };
}




