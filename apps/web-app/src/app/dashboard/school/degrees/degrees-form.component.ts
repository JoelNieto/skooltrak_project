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
import { TranslateModule } from '@ngx-translate/core';
import { Degree } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { DegreesFormStore } from './degrees-form.store';

@Component({
  selector: 'sk-degrees-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ButtonDirective,
    SelectComponent,
    LabelDirective,
    InputDirective,
  ],
  providers: [DegreesFormStore, provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'DEGREES.DETAILS' | translate }}
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
        <label for="name" skLabel>{{ 'NAME' | translate }}</label>
        <input type="text" formControlName="name" skInput />
      </div>
      <div>
        <label for="level_id" skLabel>{{ 'LEVEL' | translate }}</label>
        <sk-select
          [items]="store.levels()"
          label="name"
          formControlName="level_id"
        />
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class DegreesFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Degree>>);
  private data: Degree | undefined = inject(DIALOG_DATA);
  public store = inject(DegreesFormStore);

  public form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
