import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: `[skInput]`,
  standalone: true,
})
export class InputDirective {
  @HostBinding('class') get classes() {
    return `block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
    &.ng-invalid.ng-dirty {
      @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
    }`;
  }
}
