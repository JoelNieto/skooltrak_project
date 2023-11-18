import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[skLabel]',
  standalone: true,
})
export class LabelDirective {
  @HostBinding('class') get classes() {
    return `mb-1.5 block font-title text-sm text-gray-700 dark:text-white`;
  }
}
