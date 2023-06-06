import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { ButtonComponent, CardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-subjects-form',
  standalone: true,
  imports: [
    CardComponent,
    IconsModule,
    ButtonComponent,
    ReactiveFormsModule,
    TranslateModule,
  ],
  template: `<skooltrak-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
      >
        {{ 'Subjects.Details' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
      </button>
    </div>
    <form
      [formGroup]="form"
      class="flex flex-col space-y-3"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="name">{{ 'Name' | translate }}</label>
        <input type="text" formControlName="name" />
      </div>
      <div>
        <label for="name">{{ 'Short name' | translate }}</label>
        <input type="text" formControlName="short_name" />
      </div>
      <div>
        <label for="name">{{ 'Code' | translate }}</label>
        <input type="text" formControlName="code" />
      </div>
      <div>
        <label for="name">{{ 'Description' | translate }}</label>
        <textarea rows="3" formControlName="description"></textarea>
      </div>
      <div class="flex justify-end">
        <button
          skooltrak-button
          color="sky"
          type="submit"
          [disabled]="form.invalid"
        >
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </skooltrak-card>`,
  styles: [
    `
      input,
      textarea {
        @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500;
        &.ng-invalid.ng-dirty {
          @apply text-red-800 border-red-400 bg-red-100 focus:ring-red-600 focus:border-red-600;
        }
      }

      label {
        @apply block mb-2 text-sm font-sans text-gray-600 font-medium dark:text-white;
      }
    `,
  ],
})
export class SubjectsFormComponent implements AfterViewInit {
  public dialogRef = inject(DialogRef<Partial<Subject>>);
  private data: Subject | undefined = inject(DIALOG_DATA);
  form = new FormGroup({
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

  ngAfterViewInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
