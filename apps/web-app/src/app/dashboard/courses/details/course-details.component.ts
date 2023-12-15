import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroVideoCamera } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonDirective,
  CardComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';

import { CourseMeetingComponent } from '../../../components/course-meeting/course-meeting.component';
import { CourseDetailsStore } from './course-details.store';

@Component({
  standalone: true,
  selector: 'sk-course-details',
  imports: [
    CardComponent,
    NgClass,
    RouterLink,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
    RouterOutlet,
    NgIconComponent,
    ButtonDirective,
  ],
  providers: [provideIcons({ heroVideoCamera }), CourseDetailsStore],
  template: `
    <div>
      <sk-card>
        <div header>
          <div class="justify-between md:flex">
            <div class="mb-2">
              <h2
                class="font-title mb-1 text-xl leading-tight tracking-tight text-gray-700 dark:text-gray-50"
              >
                {{ store.course()?.subject?.name }}
              </h2>
              <h4
                class="flex font-sans text-lg font-semibold leading-tight tracking-tight text-gray-400 dark:text-gray-300"
              >
                {{ store.course()?.plan?.name }}
              </h4>
            </div>
            <div>
              <button skButton color="blue" (click)="showMeeting()">
                <ng-icon name="heroVideoCamera" size="20" />
                {{ 'COURSES.OPEN_CLASS' | translate }}
              </button>
            </div>
          </div>
        </div>
        <sk-tabs>
          <sk-tabs-item link="news">{{ 'News' | translate }}</sk-tabs-item>
          <sk-tabs-item link="schedule">{{
            'Schedule' | translate
          }}</sk-tabs-item>
          <sk-tabs-item link="grades">{{
            'GRADES.TITLE' | translate
          }}</sk-tabs-item>
          <sk-tabs-item link="files">{{ 'File' | translate }}</sk-tabs-item>
          <sk-tabs-item link="students">
            {{ 'Students' | translate }}</sk-tabs-item
          >
        </sk-tabs>
        <router-outlet />
      </sk-card>
    </div>
  `,
})
export class CourseDetailsComponent implements OnInit {
  @Input() private course_id?: string;
  public store = inject(CourseDetailsStore);

  private dialog = inject(Dialog);

  public ngOnInit(): void {
    !!this.course_id && this.store.fetchCourse(this.course_id);
  }

  public showMeeting(): void {
    this.dialog.open(CourseMeetingComponent, {
      minWidth: '90%',
      disableClose: true,
      data: this.store.course(),
    });
  }
}
