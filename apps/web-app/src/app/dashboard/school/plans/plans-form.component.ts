import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ButtonDirective, CardComponent, InputDirective, LabelDirective, SelectComponent } from '@skooltrak/ui';
import { filter } from 'rxjs';

import { PlansFormStore } from './plans-form.store';

@Component({
  selector: 'sk-admin-plans-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgIconComponent,
    SelectComponent,
    ButtonDirective,
    LabelDirective,
    InputDirective,
  ],
  providers: [
    provideComponentStore(PlansFormStore),
    provideIcons({ heroXMark }),
  ],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'PLANS.DETAILS' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          class="text-gray-700 dark:text-gray-100"
          size="24"
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
        <label for="year" skLabel>{{ 'Year' | translate }}</label>
        <select label="name" formControlName="year" skInput>
          <option [value]="-1">Pre-Kinder</option>
          <option [value]="0">Kinder</option>
          <option [value]="1">1</option>
          <option [value]="2">2</option>
          <option [value]="3">3</option>
          <option [value]="4">4</option>
          <option [value]="5">5</option>
          <option [value]="6">6</option>
          <option [value]="7">7</option>
          <option [value]="8">8</option>
          <option [value]="9">9</option>
          <option [value]="10">10</option>
          <option [value]="11">11</option>
          <option [value]="12">12</option>
        </select>
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class StudyPlansFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<StudyPlan>>);
  private data: StudyPlan | undefined = inject(DIALOG_DATA);
  public store = inject(PlansFormStore);
  private destroy = inject(DestroyRef);
  public form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
    }),
    degree_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    year: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    this.form
      .get('degree_id')
      ?.valueChanges.pipe(
        takeUntilDestroyed(this.destroy),
        filter((val) => !!val),
      )
      .subscribe({
        next: (id) => {
          const value = this.store.DEGREES().find((x) => x.id === id);
          !!value && this.form.get('level_id')?.setValue(value.level_id);
        },
      });
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
