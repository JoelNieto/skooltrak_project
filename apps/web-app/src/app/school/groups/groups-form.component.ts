import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
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
import { ClassGroup } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { GroupsFormStore } from './groups-form.store';

@Component({
  selector: 'sk-groups-form',
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    SelectComponent,
    ButtonDirective,
    LabelDirective,
  ],
  providers: [
    provideComponentStore(GroupsFormStore),
    provideIcons({ heroXMark }),
  ],
  styles: [
    `
      input,
      textarea {
        @apply block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-sky-600 focus:ring-sky-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-sky-500 dark:focus:ring-sky-500 sm:text-sm;
        &.ng-invalid.ng-dirty {
          @apply border-red-400 bg-red-100 text-red-800 focus:border-red-600 focus:ring-red-600;
        }
      }
    `,
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'GROUPS.DETAILS' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="name" skLabel>{{ 'Name' | translate }}</label>
        <input type="text" formControlName="name" />
      </div>
      <div>
        <label for="degree_id" skLabel>{{ 'Degree' | translate }}</label>
        <sk-select
          [items]="store.DEGREES()"
          label="name"
          formControlName="degree_id"
        />
      </div>
      <div>
        <label for="degree_id" skLabel>{{ 'Plan' | translate }}</label>
        <sk-select
          [items]="store.PLANS()"
          label="name"
          formControlName="plan_id"
        />
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolGroupsFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<ClassGroup>>);
  private data: ClassGroup | undefined = inject(DIALOG_DATA);
  public store = inject(GroupsFormStore);

  public form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    plan_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    degree_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
    this.form.get('degree_id')?.valueChanges.subscribe({
      next: (degree) => this.store.patchState({ SELECTED_DEGREE_ID: degree }),
    });
  }

  saveChanges() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
