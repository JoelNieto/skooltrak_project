import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@skooltrak/auth';
import { Degree, Level } from '@skooltrak/models';
import { ButtonDirective, CardComponent, SelectComponent } from '@skooltrak/ui';
import { from, map } from 'rxjs';

@Component({
  selector: 'sk-admin-degrees-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    IconsModule,
    ButtonDirective,
    SelectComponent,
  ],
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
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
      >
        {{ 'Degrees.Details' | translate }}
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
        <label for="level_id">{{ 'Level' | translate }}</label>
        <sk-select [items]="levels()" label="name" formControlName="level_id" />
      </div>
      <div class="flex justify-end">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'Save changes' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class DegreesFormComponent implements OnInit {
  public dialogRef = inject(DialogRef<Partial<Degree>>);
  private data: Degree | undefined = inject(DIALOG_DATA);
  private supabase = inject(SupabaseService);
  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    level_id: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  levels = toSignal(
    from(this.supabase.client.from('levels').select('id, name')).pipe(
      map(({ data }) => data as Level[])
    )
  );

  ngOnInit(): void {
    !!this.data && this.form.patchValue(this.data);
  }

  saveChanges() {
    this.dialogRef.close(this.form.getRawValue());
  }
}
