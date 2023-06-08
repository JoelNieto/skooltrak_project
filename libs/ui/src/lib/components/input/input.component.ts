import { Component, forwardRef, inject, Injector, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgModel,
} from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'skooltrak-input',
  standalone: true,
  imports: [FormsModule],
  template: `<ng-content
    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  ></ng-content> `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  private injector = inject(Injector);
  disable = false;
  inputControl!: FormControl;

  ngOnInit(): void {
    const injectedControl = this.injector.get(NgControl);
    switch (injectedControl.constructor) {
      case NgModel: {
        const { control, update } = injectedControl as NgModel;
        this.inputControl = control;
        this.inputControl.valueChanges.pipe(
          tap((value: string) => update.emit(value))
        );
        break;
      }
      case FormControlName: {
        this.inputControl = this.injector
          .get(FormGroupDirective)
          .getControl(injectedControl as FormControlName);
        break;
      }
      default: {
        this.inputControl = (injectedControl as FormControlDirective)
          .form as FormControl;
      }
    }
  }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
}
