import { AbstractControl } from '@angular/forms';

export class PasswordValidators {
  public static matchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value;
    const confirmPassword: string = control.get('confirmPassword')?.value;

    if (confirmPassword.length) {
      return null;
    }

    if (confirmPassword !== password) {
      control.get('confirm_password')?.setErrors({ mismatch: true });
    }

    return null;
  }
}
