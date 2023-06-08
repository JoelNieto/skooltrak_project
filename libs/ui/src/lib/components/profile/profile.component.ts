import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { state } from '@skooltrak/auth';

import { CardComponent } from '../card/card.component';

@Component({
  selector: 'skooltrak-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent],
  template: `
    <div class="px-12 pt-4">
      <skooltrak-card>
        <h2
          header
          class=" sticky top-0 pb-3 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-mono font-bold"
        >
          Profile
        </h2>
        <form [formGroup]="form" class="space-y-4">
          <div>
            <label for="email" class="label">Email</label>
            <input type="email" class="input" formControlName="email" />
          </div>
          <div>
            <label for="full_name" class="label">Full name</label>
            <input type="text" class="input" formControlName="full_name" />
          </div>
        </form>
      </skooltrak-card>
    </div>
  `,
  styles: [
    `
      .input {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
      }

      .label {
        @apply block mb-2 text-sm font-sans text-gray-600 font-medium dark:text-white;
      }
    `,
  ],
})
export class ProfileComponent {
  private store = inject(Store);
  user = this.store.selectSignal(state.selectors.selectUser);

  form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    full_name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    avatar_url: new FormControl<string>('', { nonNullable: true }),
  });

  constructor() {
    effect(() => this.form.patchValue(this.user()!));
  }
}
