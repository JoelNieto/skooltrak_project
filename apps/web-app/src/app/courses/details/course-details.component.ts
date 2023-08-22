import { IconsModule } from '@amithvns/ng-heroicons';
import { NgClass, NgFor } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { CoursesStore } from '../courses.store';

@Component({
  standalone: true,
  selector: 'sk-course-details',
  imports: [
    CardComponent,
    NgFor,
    NgClass,
    RouterLink,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
    RouterOutlet,
    IconsModule,
  ],
  template: `<div class="flex gap-4">
    <sk-card class="w-64 flex-none">
      <div header>
        <h2
          class="font-title mb-1 flex text-lg leading-tight tracking-tight text-gray-700 dark:text-white"
        >
          {{ 'Courses' | translate }}
        </h2>
      </div>
      <ul class="mt-4 flex flex-col gap-1">
        <li *ngFor="let course of store.courses()">
          <a
            class="block cursor-pointer rounded-lg px-2 py-1.5 text-gray-600 dark:text-gray-200"
            [ngClass]="{
              'bg-sky-100 font-semibold text-sky-800 dark:text-sky-900':
                course.id === store.selectedId()
            }"
            (click)="setSelectedId(course.id!)"
            >{{ course.subject?.name }} - {{ course.plan.year }}°</a
          >
        </li>
        <li>
          <a class="mt-4 flex gap-2 font-bold text-sky-700" routerLink="../"
            ><icon name="arrow-left-circle" /> {{ 'Go back' | translate }}</a
          >
        </li>
      </ul>
    </sk-card>
    <div class="flex flex-1 flex-col gap-4">
      <sk-card>
        <div header>
          <div class="justify-between md:flex">
            <div>
              <h2
                class="font-title mb-1 flex text-xl leading-tight tracking-tight text-gray-700 dark:text-gray-50"
              >
                {{ store.selected()?.subject?.name }}
              </h2>
              <h4
                class="flex font-sans text-lg font-semibold leading-tight tracking-tight text-gray-400 dark:text-gray-300"
              >
                {{ store.selected()?.plan?.name }}
              </h4>
            </div>
          </div>
        </div>
      </sk-card>
      <sk-card>
        <div skooltrak-tabs>
          <sk-tabs-item link="news">{{ 'News' | translate }}</sk-tabs-item>
          <sk-tabs-item link="schedule">{{
            'Schedule' | translate
          }}</sk-tabs-item>
          <sk-tabs-item link="files">{{ 'Files' | translate }}</sk-tabs-item>
          <sk-tabs-item link="files">{{ 'File' | translate }}</sk-tabs-item>
        </div>
        <router-outlet />
      </sk-card>
    </div>
  </div>`,
})
export class CourseDetailsComponent implements OnInit {
  @Input() course_id?: string;
  store = inject(CoursesStore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    !!this.course_id && this.store.patchState({ selectedId: this.course_id });
  }

  setSelectedId = (course_id: string) => {
    this.store.patchState({ selectedId: course_id });
    this.router.navigate(['../details'], {
      relativeTo: this.route,
      queryParams: { course_id },
    });
  };
}
