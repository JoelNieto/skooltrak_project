import { DatePipe, NgFor } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonDirective,
  CardComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';

import { AssignmentDetailsStore } from './assignment-details.store';

@Component({
  standalone: true,
  selector: 'sk-assignment-details',
  imports: [
    CardComponent,
    DatePipe,
    TranslateModule,
    NgFor,
    ButtonDirective,
    TabsItemComponent,
    RouterOutlet,
    TabsComponent,
    RouterLink,
  ],
  providers: [provideComponentStore(AssignmentDetailsStore)],
  template: `
    <div class="flex gap-4">
      <sk-card class="flex-1">
        <div header class="flex items-start justify-between">
          <div>
            <h3
              class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
            >
              {{ assignment()?.title }}
            </h3>
            <a
              class="font-title text-gray-500 dark:text-gray-100"
              routerLink="/app/courses/details/"
              [queryParams]="{ course_id: assignment()!.course_id }"
            >
              {{ assignment()?.course?.subject?.name }} /
              {{ assignment()?.course?.plan?.name }}
            </a>
            <p class="mb-4 font-sans text-sky-600 dark:text-gray-100">
              {{ assignment()?.type?.name }}
            </p>
          </div>
          <button skButton color="green">{{ 'Edit' | translate }}</button>
        </div>
        <div>
          <div skooltrak-tabs>
            <sk-tabs-item link="instructions">{{
              'Instructions' | translate
            }}</sk-tabs-item>
            <sk-tabs-item link="students-work">{{
              'Students work' | translate
            }}</sk-tabs-item>
          </div>
          <router-outlet />
        </div>
      </sk-card>
      <sk-card class="w-72 ">
        <div header>
          <h2
            class="font-title mb-3 flex text-lg leading-tight tracking-tight text-gray-700 dark:text-white"
          >
            {{ 'Groups' | translate }}
          </h2>
        </div>
        <div>
          <div
            class="mb-2 flex flex-col "
            *ngFor="let date of assignment()?.dates"
          >
            <div
              class="font-sans font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ date.group.name }}
            </div>
            <div class="font-sans text-gray-500 dark:text-gray-100">
              {{ date.start_at | date : 'medium' }}
            </div>
          </div>
        </div>
      </sk-card>
    </div>
  `,
})
export class AssignmentDetailsComponent implements OnInit {
  @Input() id: string | undefined;

  private store = inject(AssignmentDetailsStore);

  public assignment = this.store.assignment;

  public ngOnInit(): void {
    !!this.id && this.store.patchState({ assignment_id: this.id });
  }
}
