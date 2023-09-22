import { NgClass, NgFor } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeftCircle } from '@ng-icons/heroicons/outline';
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
    NgIconComponent,
  ],
  providers: [provideIcons({ heroArrowLeftCircle })],
  template: `
    <div class="">
      <sk-card>
        <div header>
          <div class="justify-between md:flex">
            <div>
              <h2
                class="font-title mb-1 text-xl leading-tight tracking-tight text-gray-700 dark:text-gray-50"
              >
                {{ selected()?.subject?.name }}
              </h2>
              <h4
                class="flex font-sans text-lg font-semibold leading-tight tracking-tight text-gray-400 dark:text-gray-300"
              >
                {{ selected()?.plan?.name }}
              </h4>
              <a class="mt-2 flex gap-2 font-bold text-sky-700" routerLink="../"
                ><ng-icon name="heroArrowLeftCircle" size="24" />
                {{ 'Go back' | translate }}</a
              >
            </div>
            <div>
              <h4 class="font-sans text-lg text-gray-600 dark:text-gray-200">
                {{ selected()?.period?.name }}
              </h4>
            </div>
          </div>
        </div>
        <div skooltrak-tabs>
          <sk-tabs-item link="news">{{ 'News' | translate }}</sk-tabs-item>
          <sk-tabs-item link="schedule">{{
            'Schedule' | translate
          }}</sk-tabs-item>
          <sk-tabs-item link="grades">{{
            'Grades.Title' | translate
          }}</sk-tabs-item>
          <sk-tabs-item link="files">{{ 'File' | translate }}</sk-tabs-item>
        </div>
        <router-outlet />
      </sk-card>
    </div>
  `,
})
export class CourseDetailsComponent implements OnInit {
  @Input() course_id?: string;
  private store = inject(CoursesStore);
  selected = this.store.selected;
  courses = this.store.courses;
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
