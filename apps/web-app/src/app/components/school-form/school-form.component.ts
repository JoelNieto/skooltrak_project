import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { School, SchoolTypeEnum } from '@skooltrak/models';
import {
  ButtonDirective,
  CardComponent,
  ImageCropperComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { AvatarComponent } from '../avatar/avatar.component';
import { SchoolFormStore } from './school-form.store';

@Component({
  standalone: true,
  selector: 'sk-school-form',
  imports: [
    ReactiveFormsModule,
    CardComponent,
    ButtonDirective,
    AvatarComponent,
    TranslateModule,
    SelectComponent,
    NgIconComponent,
    LabelDirective,
    InputDirective,
  ],
  providers: [SchoolFormStore, provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'SCHOOL.INFO' | translate }}
      </h3>
      <button (click)="dialogRef.close()">
        <ng-icon
          name="heroXMark"
          size="24"
          class="text-gray-700 dark:text-gray-100"
        />
      </button>
    </div>
    <div class="flex flex-col items-center justify-center space-y-4">
      @if (store.school()?.crest_url) {
        <sk-avatar
          [fileName]="store.school()?.crest_url!"
          (click)="uploadCrest()"
          bucket="crests"
          class="h-24 rounded-md"
        />
      } @else {
        <img
          (click)="uploadCrest()"
          src="assets/images/skooltrak-logo.svg"
          class="h-24"
          alt="Skooltrak Logo"
        />
      }
    </div>
    <form
      [formGroup]="form"
      class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
      (ngSubmit)="saveChanges()"
    >
      <div>
        <label for="short_name" skLabel>{{
          'SCHOOL.SHORT_NAME' | translate
        }}</label>
        <input type="text" formControlName="short_name" skInput />
      </div>
      <div>
        <label for="full_name" skLabel>{{
          'SCHOOL.FULL_NAME' | translate
        }}</label>
        <input type="text" formControlName="full_name" skInput />
      </div>
      <div>
        <label for="type" skLabel>{{ 'SCHOOL.TYPE' | translate }}</label>
        <select formControlName="type" skInput>
          @for (type of types(); track type) {
            <option [value]="type">
              {{ 'SCHOOL_TYPE.' + type | translate }}
            </option>
          }
        </select>
      </div>
      <div>
        <label for="country_id" skLabel>{{
          'SCHOOL.COUNTRY' | translate
        }}</label>
        <sk-select
          formControlName="country_id"
          [items]="store.countries()"
          label="name"
        />
      </div>
      <div>
        <label for="address" skLabel>{{ 'SCHOOL.ADDRESS' | translate }}</label>
        <input type="text" formControlName="address" skInput />
      </div>
      <div>
        <label for="contact_email" skLabel>{{
          'SCHOOL.EMAIL' | translate
        }}</label>
        <input type="email" formControlName="contact_email" skInput />
      </div>
      <div>
        <label for="contact_phone" skLabel>{{
          'SCHOOL.PHONE' | translate
        }}</label>
        <input type="tel" formControlName="contact_phone" skInput />
      </div>
      <div class="col-span-2">
        <label for="motto" skLabel>{{ 'SCHOOL.MOTTO' | translate }}</label>
        <input type="text" formControlName="motto" skInput />
      </div>
      <div class="col-span-4 flex justify-end">
        <button
          type="submit"
          skButton
          color="sky"
          [disabled]="this.form.invalid || this.form.untouched"
        >
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolFormComponent implements OnInit {
  public store = inject(SchoolFormStore);
  private dialog = inject(Dialog);
  public dialogRef = inject(DialogRef);
  private destroyRef = inject(DestroyRef);

  private data: School | undefined = inject(DIALOG_DATA);
  public types = signal(Object.values(SchoolTypeEnum));

  public form = new FormGroup({
    id: new FormControl<string>('', { nonNullable: true }),
    full_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    short_name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    motto: new FormControl<string>('', { nonNullable: true }),
    address: new FormControl<string>('', { nonNullable: true }),
    contact_email: new FormControl<string>('', {
      validators: [Validators.email],
      nonNullable: true,
    }),
    type: new FormControl<SchoolTypeEnum | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contact_phone: new FormControl('', { nonNullable: true }),
    country_id: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor() {
    effect(() => {
      const school = this.store.school();
      !!school && this.form.patchValue(school);
    });
  }

  public ngOnInit(): void {
    !!this.data && patchState(this.store, { school: this.data });
  }

  public uploadCrest(): void {
    const dialogRef = this.dialog.open<{
      imageFile: File | undefined;
      cropImgPreview: string;
    }>(ImageCropperComponent, {
      width: '48rem',
      maxWidth: '90%',
      data: { ratio: 2 },
    });
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        if (!result) return;
        const { imageFile } = result;
        !!imageFile && this.store.uploadCrest(imageFile);
      },
    });
  }

  public saveChanges(): void {
    const { value } = this.form;
    const request = { ...this.store.school(), ...value };

    if (!request.id) {
      delete request.id;
    }
    delete request.country;
    this.store.saveSchool(request);
  }
}
