import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
  private static readonly errorMessages = {
    'required': () => 'The field is required',
    'minlength': (params) => 'The Minimum number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The Maximum allowed number of characters is ' + params.requiredLength,
    'max': (params) => 'Maximum value is ' + params.max,
    'min': (params) => 'Minimum value is ' + params.min,
    'emailError': () => 'Enter a valid email address',
    'spaceValidator': () => 'String with only Empty spaces not allowed',
    'pattern': () => `Enter valid input`,
    'rangeError': () => 'Min value cannot be greater than Max range',
    'controlRangeError': () => 'Control min range can not be greater than Control max range',
    'inValidLink': () => 'Enter a valid link',
    'ibpError':() => 'Set same precision',
  };
  @Input() control: AbstractControl;
  constructor() {
  }

  ngOnInit() {
  }
  showErrors() {
    return this.control && this.control.errors && (this.control.dirty || this.control.touched);
  }

  errors(): string[] {
    return Object.keys(this.control.errors).map(data => this.getMessage(data, this.control.errors[data]));

  }

  private getMessage(type: string, params: any) {
    return ErrorComponent.errorMessages[type](params);
  }
}
