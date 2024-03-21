import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

import { PublicationItemComponent } from '../../components/publication-item/publication-item.component';
import { PublicationsStore } from './publications.store';

@Component({
  selector: 'sk-publications',
  standalone: true,
  providers: [PublicationsStore],
  template: `<div class="flex gap-6 w-full">
    <sk-card class="w-72">
      <div header>
        <h3 class="text-xl font-semibold font-title text-gray-700">
          {{ 'ASSIGNMENTS.TODAY' | translate }}
        </h3>
      </div>
    </sk-card>
    <div class="flex-1 flex flex-col gap-4">
      <sk-card>
        <div header>
          <h2
            class="font-title mb-2 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ 'PUBLICATIONS.NEW' | translate }}
          </h2>
        </div>
        <form [formGroup]="form" (ngSubmit)="newPost()">
          <mat-form-field class="w-full">
            <textarea
              formControlName="body"
              type="text"
              matInput
              rows="3"
              [placeholder]="'PUBLICATIONS.BODY' | translate"
            ></textarea>
          </mat-form-field>
          <div class="flex justify-between items-start">
            <mat-form-field class="w-3/5">
              <mat-label>{{ 'PUBLICATIONS.COURSE' | translate }}</mat-label>
              <mat-select formControlName="course_id">
                <mat-option>{{
                  'PUBLICATIONS.PUBLIC_FILTER' | translate
                }}</mat-option>
                @for (course of store.courses(); track course.id) {
                  <mat-option [value]="course.id"
                    >{{ course.subject?.name }} -
                    {{ course.plan?.name }}</mat-option
                  >
                }
              </mat-select>
            </mat-form-field>
            <button
              type="submit"
              mat-flat-button
              color="primary"
              [disabled]="form.invalid"
            >
              {{ 'PUBLICATIONS.PUBLISH' | translate }}
            </button>
          </div>
        </form>
      </sk-card>
      <div class="flex flex-col gap-4">
        @for (publication of store.publications(); track publication.id) {
          <sk-publication-item
            [post]="publication"
            (deleted)="store.removePublication($event)"
          />
        } @empty {
          @if (store.loading()) {
            <sk-card>
              <div class="animate-pulse">
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 bg-slate-200 rounded"></div>
                  <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                      <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </sk-card>
            <sk-card>
              <div class="animate-pulse">
                <div class="flex-1 space-y-6 py-1">
                  <div class="h-2 bg-slate-200 rounded"></div>
                  <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                      <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </sk-card>
          }
        }
      </div>
    </div>
    <div class="w-72"></div>
  </div> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    PublicationItemComponent,
  ],
})
export class PublicationsComponent implements OnInit {
  public form = new FormGroup({
    body: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    course_id: new FormControl<string | undefined>(undefined, {
      nonNullable: true,
    }),
  });
  public textControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  public store = inject(PublicationsStore);

  public ngOnInit(): void {
    setTimeout(() => {
      this.store.getPublications();
    }, 1000);
  }

  public newPost(): void {
    this.store.savePublication({
      request: this.form.getRawValue(),
    });

    setTimeout(() => {
      this.form.reset();
      this.form.setErrors(null);
    }, 500);
  }
}
