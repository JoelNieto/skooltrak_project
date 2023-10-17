import { DialogRef } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';
import { ButtonDirective, CardComponent, ConfirmationService } from '@skooltrak/ui';

import { SchoolConnectorStore } from './school-connector.store';

@Component({
  standalone: true,
  selector: 'sk-school-connector',
  imports: [
    CardComponent,
    NgIconComponent,
    TranslateModule,
    NgFor,
    NgIf,
    ButtonDirective,
    ReactiveFormsModule,
  ],
  providers: [
    provideComponentStore(SchoolConnectorStore),
    provideIcons({ heroXMark }),
    ConfirmationService,
  ],
  styles: [
    `
      input,
      select {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
      label {
        @apply mb-2 block font-sans text-sm font-medium text-gray-600 dark:text-white;
      }
      quill-editor {
        @apply block p-0;
      }

      ::ng-deep .ql-container.ql-snow,
      ::ng-deep .ql-toolbar.ql-snow {
        @apply border-0;
      }
    `,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Select school' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <form [formGroup]="form" (ngSubmit)="validateCode()">
      <p class="mb-2 text-sm italic text-gray-500">
        {{ 'School Connector.Message' | translate }}
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="code">Code</label>
          <input type="text" formControlName="code" />
          <small
            *ngIf="form.get('code')?.hasError('minlength')"
            class="font-mono text-xs text-red-500"
            >{{ 'Errors.minLength' | translate : { length: 10 } }}</small
          >
        </div>
        <div>
          <label for="role">{{ 'Role' | translate }}</label>
          <select formControlName="role">
            <option *ngFor="let role of roles" [value]="role">
              {{ role | translate }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button skButton color="green" type="submit" [disabled]="!form.valid">
          + {{ 'Add' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolConnectorComponent {
  public dialogRef = inject(DialogRef);
  public roles = Object.values(RoleEnum);
  private store = inject(SchoolConnectorStore);
  private numberRegEx = /^\d+$/;

  public form = new FormGroup({
    code: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(this.numberRegEx),
      ],
      updateOn: 'blur',
    }),
    role: new FormControl<RoleEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public validateCode(): void {
    const { code, role } = this.form.getRawValue();
    this.store.patchState({ ROLE: role });
    this.store.fetchSchoolByCode(code);
  }
}
