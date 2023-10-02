import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[skLabel]',
  standalone: true,
})
export class LabelDirective {
  @HostBinding('class') get classes() {
    return `mb-2 block font-sans text-sm font-medium text-gray-500 dark:text-white`;
  }
}
