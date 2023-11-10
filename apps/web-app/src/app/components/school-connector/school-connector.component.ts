import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  ConfirmationService,
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

import { SchoolConnectorStore } from './school-connector.store';

@Component({
  standalone: true,
  selector: 'sk-school-connector',
  imports: [
    CardComponent,
    NgIconComponent,
    TranslateModule,
    ButtonDirective,
    ReactiveFormsModule,
    LabelDirective,
    InputDirective,
  ],
  providers: [
    provideComponentStore(SchoolConnectorStore),
    provideIcons({ heroXMark }),
    ConfirmationService,
  ],
  styles: `
      quill-editor {
        @apply block p-0;
      }

      ::ng-deep .ql-container.ql-snow,
      ::ng-deep .ql-toolbar.ql-snow {
        @apply border-0;
      }
  `,
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'SCHOOL_CONNECTOR.CONNECT' | translate }}
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
          <label for="code" skLabel>{{ 'CODE' | translate }}</label>
          <input type="text" formControlName="code" skInput />
          @if(form.get('code')?.hasError('minlength')) {
          <small class="font-mono text-xs text-red-500">{{
            'Errors.minLength' | translate: { length: 10 }
          }}</small>
          }
        </div>
        <div>
          <label for="role" skLabel>{{ 'ROLE' | translate }}</label>
          <select formControlName="role" skInput>
            @for(role of roles; track role) {
            <option [value]="role">
              {{ role | translate }}
            </option>
            }
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button skButton color="green" type="submit" [disabled]="!form.valid">
          + {{ 'ADD' | translate }}
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
