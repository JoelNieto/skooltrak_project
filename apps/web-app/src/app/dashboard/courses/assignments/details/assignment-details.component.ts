import { DatePipe } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
    ButtonDirective,
    TabsItemComponent,
    RouterOutlet,
    TabsComponent,
    RouterLink,
  ],
  providers: [AssignmentDetailsStore],
  template: `
    <div class="flex gap-4">
      <sk-card class="flex-1">
        <div header class="flex items-start justify-between">
          <div>
            <h3
              class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
            >
              {{ store.assignment()?.title }}
            </h3>
            <a
              class="font-title text-gray-500 dark:text-gray-100"
              routerLink="/app/courses/details/"
              [queryParams]="{ course_id: store.assignment()?.course_id }"
            >
              {{ store.assignment()?.course?.subject?.name }} /
              {{ store.assignment()?.course?.plan?.name }}
            </a>
            <p class="mb-4 font-sans text-sky-600 dark:text-gray-100">
              {{ store.assignment()?.type?.name }}
            </p>
          </div>
          <a skButton color="green" routerLink="edit">{{
            'Edit' | translate
          }}</a>
        </div>
        <div>
          <sk-tabs>
            <sk-tabs-item link="instructions">{{
              'ASSIGNMENTS.INSTRUCTIONS' | translate
            }}</sk-tabs-item>
            <sk-tabs-item link="students-work">{{
              'ASSIGNMENTS.WORK' | translate
            }}</sk-tabs-item>
            <sk-tabs-item link="grades">{{
              'ASSIGNMENTS.GRADES' | translate
            }}</sk-tabs-item>
          </sk-tabs>
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
          @for (date of store.assignment()?.dates; track date.group.id) {
            <div class="mb-2 flex flex-col ">
              <div
                class="font-sans font-semibold text-gray-700 dark:text-gray-200"
              >
                {{ date.group.name }}
              </div>
              <div class="font-sans text-gray-500 dark:text-gray-100">
                {{ date.start_at | date: 'medium' }}
              </div>
            </div>
          }
        </div>
      </sk-card>
    </div>
  `,
})
export class AssignmentDetailsComponent implements OnInit {
  private id = input.required<string>();

  public store = inject(AssignmentDetailsStore);

  public ngOnInit(): void {
    this.store.fetchAssignment(this.id());
  }
}
