import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validator,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { QuillEditorBase } from 'ngx-quill';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

class MatQuillBase extends QuillEditorBase {
  stateChanges = new Subject<void>();

  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl,
  ) {
    super();
  }
}

@Directive()
export abstract class _MatQuillBase
  implements
    ControlValueAccessor,
    MatFormFieldControl<any>,
    OnChanges,
    OnDestroy,
    Validator
{
  abstract controlType: string;
  focused = false;
  abstract id: string;
  private contentChangedSubscription: Subscription;
  private blurSubscription: Subscription;
  private focusSubscription: Subscription;

  constructor(
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Optional() @Self() public override ngControl: NgControl,
  ) {
    super(parentForm, parentFormGroup, ngControl);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.contentChangedSubscription = this.onContentChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe({
        next: () => {
          this.updateErrorState();
          this.stateChanges.next();
        },
      });

    this.blurSubscription = this.onBlur.subscribe({
      next: () => {
        this.focused = false;
        if (!!this.ngControl && !this.ngControl.control!.touched) {
          this.ngControl.control!.markAsTouched();
          this.updateErrorState();
        }
        this.stateChanges.next();
      },
    });

    this.focusSubscription = this.onFocus.subscribe({
      next: () => {
        this.focused = true;
        this.stateChanges.next();
      },
    });
  }
  stateChanges: Observable<void>;
  errorState: boolean;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
  stateChanges: Observable<void>;
  errorState: boolean;
  autofilled?: boolean | undefined;
  userAriaDescribedBy?: string | undefined;
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }

  override ngOnDestroy() {
    this.contentChangedSubscription.unsubscribe();
    this.blurSubscription.unsubscribe();
    this.focusSubscription.unsubscribe();
    super.ngOnDestroy();
  }
  /*
   * GETTERS & SETTERS
   */

  @Input()
  override disabled = false;

  get empty() {
    return !coerceBooleanProperty(this.value);
  }

  @Input()
  override placeholder = '';

  @Input()
  override required = false;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get value(): any {
    try {
      return this.valueGetter(this.quillEditor);
    } catch (e) {
      return;
    }
  }
  set value(value: any) {
    this.writeValue(value);
    this.stateChanges.next();
  }

  /*
   * METHODS
   */

  blur() {
    (this.editorElem.childNodes as NodeListOf<HTMLElement>)[0]['blur']();
  }

  focus() {
    this.quillEditor.focus();
  }

  @HostBinding('attr.aria-describedby') _describedBy = '';
  setDescribedByIds(ids: string[]) {
    this._describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if (!this.focused) {
      this.quillEditor.focus();
    }
  }

  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  static ngAcceptInputType_required: boolean | string | null | undefined;
}
