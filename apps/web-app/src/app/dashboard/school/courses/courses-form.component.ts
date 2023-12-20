import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Course, Table, User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import {
  ButtonDirective,
  CardComponent,
  ImageCropperComponent,
  InputDirective,
  LabelDirective,
  SelectComponent,
} from '@skooltrak/ui';

import { PictureComponent } from '../../../components/picture/picture.component';
import { UsersSelectorComponent } from '../../../components/users-selector/users-selector.component';
import { CoursesFormStore } from './courses-form.store';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    TranslateModule,
    NgIconComponent,
    ReactiveFormsModule,
    SelectComponent,
    ButtonDirective,
    UsersSelectorComponent,
    LabelDirective,
    InputDirective,
    NgOptimizedImage,
    PictureComponent,
  ],
  providers: [CoursesFormStore, provideIcons({ heroXMark })],
  template: `<sk-card>
    <div class="flex items-start justify-between" header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'COURSES.DETAILS' | translate }}
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
      class="grid grid-cols-2 gap-2 gap-y-3"
      (ngSubmit)="saveChanges()"
    >
      @if (data) {
        <div class="col-span-2 rounded cursor-pointer hover:opacity-70">
          <sk-picture
            [bucket]="bucket()"
            class="rounded"
            [pictureURL]="pictureUrl()"
            (click)="changePicture()"
          />
        </div>
      }
      <div>
        <label for="plan_id" skLabel>{{ 'COURSES.PLAN' | translate }}</label>
        <sk-select
          label="name"
          [items]="store.plans()"
          formControlName="plan_id"
        />
      </div>
      <div>
        <label for="subject_id" skLabel>{{
          'COURSES.SUBJECT' | translate
        }}</label>
        <sk-select
          label="name"
          [items]="store.subjects()"
          formControlName="subject_id"
        />
      </div>
      <div>
        <label for="weekly_hours" skLabel>{{
          'COURSES.WEEKLY_HOURS' | translate
        }}</label>
        <input skInput formControlName="weekly_hours" type="number" />
      </div>
      <div>
        <label skLabel>{{ 'COURSES.TEACHERS' | translate }}</label>
        <sk-users-selector formControlName="teachers" />
      </div>
      <div class="col-span-2">
        <label for="description" skLabel>{{ 'DESCRIPTION' | translate }}</label>
        <textarea skInput formControlName="description"></textarea>
      </div>
      <div class="flex justify-end col-span-2">
        <button skButton color="sky" type="submit" [disabled]="form.invalid">
          {{ 'SAVE_CHANGES' | translate }}
        </button>
      </div>
    </form>
  </sk-card>`,
})
export class SchoolCoursesFormComponent implements OnInit {
  public store = inject(CoursesFormStore);
  public dialog = inject(Dialog);
  public dialogRef = inject(DialogRef);
  public data: Course | undefined = inject(DIALOG_DATA);
  public pictureUrl = signal('default_picture.jpeg');
  public bucket = signal('courses');

  private supabase = inject(SupabaseService);

  public form = new FormGroup({
    plan_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    subject_id: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    weekly_hours: new FormControl<number>(0, {
      nonNullable: true,
    }),
    teachers: new FormControl<Partial<User>[]>([], { nonNullable: true }),
    description: new FormControl<string>('', { nonNullable: true }),
  });

  public ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      const { picture_url } = this.data;
      !!picture_url && this.pictureUrl.set(picture_url);
    }
  }

  public changePicture(): void {
    this.dialog
      .open<{ imageFile: File | undefined; cropImgPreview: string }>(
        ImageCropperComponent,
        {
          width: '48rem',
          maxWidth: '90%',
          data: { fixedRatio: true, ratio: 2, format: 'jpeg' },
        },
      )
      .closed.subscribe({
        next: async (res) => {
          if (!res) return;
          const { cropImgPreview, imageFile } = res;
          this.pictureUrl.set(cropImgPreview);
          if (!imageFile) {
            return;
          }
          const { data, error: uploadError } =
            await this.supabase.uploadPicture(imageFile, 'courses');
          if (uploadError) {
            console.error('upload', uploadError);

            return;
          }
          this.pictureUrl.set(data.path);
          if (data.path) {
            const { error } = await this.supabase.client
              .from(Table.Courses)
              .update({ picture_url: data.path })
              .eq('id', this.data?.id);
            if (error) {
              console.error(error);

              return;
            }
          }
        },
      });
  }

  public saveChanges(): void {
    this.dialogRef.close(this.form.getRawValue(), {});
  }
}
