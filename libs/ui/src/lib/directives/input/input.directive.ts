import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: `[skInput]`,
  standalone: true,
})
export class InputDirective implements OnInit {
  private control = inject(NgControl);
  private elRef = inject(ElementRef);
  private translate = inject(TranslateService);
  private errorId = '';

  @HostBinding('class') get classes() {
    return 'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm';
  }

  ngOnInit(): void {
    const { name } = this.control;
    this.errorId = `${name}-error`;
    this.control.statusChanges?.subscribe({
      next: (status) => {
        this.removeError();
        if (status === 'INVALID') {
          this.elRef.nativeElement.classList.add('border-red-400');
          this.elRef.nativeElement.classList.add('bg-red-100');
          this.elRef.nativeElement.classList.add('text-red-800');
          this.elRef.nativeElement.classList.add('focus:border-red-600');
          this.elRef.nativeElement.classList.add('focus:ring-red-600');
          this.elRef.nativeElement.classList.add('dark:bg-red-300');
          this.elRef.nativeElement.classList.add('dark:border-red-800');
          this.elRef.nativeElement.classList.add('dark:focus:border-red-700');
          this.elRef.nativeElement.classList.add('dark:focus:ring-red-700');
          this.elRef.nativeElement.classList.remove('focus:ring-sky-600');
          this.elRef.nativeElement.classList.remove('focus:border-sky-600');
          this.getError();
          return;
        }
        this.elRef.nativeElement.classList.remove('border-red-400');
        this.elRef.nativeElement.classList.remove('bg-red-100');
        this.elRef.nativeElement.classList.remove('text-red-800');
        this.elRef.nativeElement.classList.remove('focus:border-red-600');
        this.elRef.nativeElement.classList.remove('focus:ring-red-600');
        this.elRef.nativeElement.classList.remove('dark:border-red-300');
        this.elRef.nativeElement.classList.remove('dark:focus:border-red-800');
        this.elRef.nativeElement.classList.remove('dark:focus:ring-red-700');
        this.elRef.nativeElement.classList.remove('dark:bg-red-300');
        this.elRef.nativeElement.classList.add('focus:ring-sky-600');
        this.elRef.nativeElement.classList.add('focus:border-sky-600');
        this.removeError();
      },
    });
  }

  getError() {
    const { errors } = this.control;
    let errorMsg = 'INPUT.INVALID';
    if (errors?.['required']) {
      errorMsg = 'INPUT.REQUIRED';
    }
    const errorMessage = `<span class="text-red-500 text-xs font-mono dark:text-red-300" id="${
      this.errorId
    }">${this.translate.instant(errorMsg)}</span>`;
    this.elRef.nativeElement.parentElement.insertAdjacentHTML(
      'beforeend',
      errorMessage,
    );
  }

  removeError() {
    const errorItem = document.getElementById(this.errorId);
    if (errorItem) {
      errorItem.remove();
    }
  }
}
