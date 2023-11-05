import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  InputDirective,
  LabelDirective,
} from '@skooltrak/ui';

@Component({
  selector: 'sk-school-subjects-form',
  standalone: true,
  imports: [
    CardComponent,
    NgIconComponent,
    ButtonDirective,
    ReactiveFormsModule,
    TranslateModule,
    LabelDirective,
    InputDirective,
  ],
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title mb-4 text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'Subjects.Details' | translate }}
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
        <label for="short_name" skLabel>{{ 'Short name' | translate }}</label>
        <input type="text" formControlName="short_name" skInput />
      </div>
      <div>
        <label for="code" skLabel>{{ 'Code' | translate }}</label>
        <input type="text" formControlName="code" skInput />
      </div>
      <div>
        <label for="description" skLabel>{{ 'Description' | translate }}</label>
        <textarea rows="3" formControlName="description" skInput></textarea>
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SubjectsFormComponent implements AfterViewInit {
  public dialogRef = inject(DialogRef<Partial<Subject>>);
  private data: Subject | undefined = inject(DIALOG_DATA);
  public form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(15)],
    }),
    code: new FormControl<string>('', {
      nonNullable: true,
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
    }),
  });

  public ngAfterViewInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue());
  }
}
