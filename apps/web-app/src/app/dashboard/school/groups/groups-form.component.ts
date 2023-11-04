import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  InputDirective,
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
    InputDirective,
  ],
  providers: [
    provideComponentStore(GroupsFormStore),
    provideIcons({ heroXMark }),
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
        <input type="text" formControlName="name" skInput />
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
  private destroyRef = inject(DestroyRef);

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

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
    this.form
      .get('degree_id')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (degree) => this.store.patchState({ SELECTED_DEGREE_ID: degree }),
      });
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
