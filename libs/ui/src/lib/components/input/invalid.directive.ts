/* eslint-disable @angular-eslint/directive-selector */
import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[skInput].ng-invalid',
  standalone: true,
})
export class InvalidDirective {
  @HostBinding('class') get classes() {
    return 'border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600';
  }
}
