import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

import { PublicationItemComponent } from '../../../components/publication-item/publication-item.component';
import { CourseNewsStore } from './course-news.store';

@Component({
  standalone: true,
  selector: 'sk-course-news',
  providers: [CourseNewsStore],
  template: `<div class="flex gap-6 w-full mt-4 px-6">
    <sk-card class="w-72">
      <div header>
        <h3 class="text-xl font-semibold font-title text-gray-700">
          {{ 'ASSIGNMENTS.TODAY' | translate }}
        </h3>
      </div>
    </sk-card>
    <div class="flex-1 flex flex-col gap-2">
      <sk-card>
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
          <sk-publication-item [post]="publication" />
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
  </div>`,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    CardComponent,
    ReactiveFormsModule,
    PublicationItemComponent,
  ],
})
export class CourseNewsComponent {
  public store = inject(CourseNewsStore);
  public form = new FormGroup({
    body: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public newPost(): void {
    this.store.savePublication({
      request: this.form.getRawValue(),
    });

    setTimeout(() => {
      this.form.reset();
    }, 500);
  }
}
