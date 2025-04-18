import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CourseMeetingComponent } from '../../../components/course-meeting/course-meeting.component';
import { CourseDetailsStore } from './course-details.store';

@Component({
  selector: 'sk-course-details',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    RouterOutlet,
    MatButton,
    MatIcon,
    MatTabsModule,
  ],
  providers: [CourseDetailsStore],
  template: `
    <div>
      <div class="justify-between md:flex">
        <div class="flex items-baseline gap-2">
          <h2 class="mat-display-small">
            {{ store.course()?.subject?.name }}
            /
          </h2>
          <h4 class="mat-headline-small">
            {{ store.course()?.plan?.name }}
          </h4>
        </div>
        <div>
          <button mat-flat-button color="primary" (click)="showMeeting()">
            <mat-icon>videocam</mat-icon>
            {{ 'COURSES.OPEN_CLASS' | translate }}
          </button>
        </div>
      </div>

      <nav mat-tab-nav-bar [tabPanel]="panel">
        <nav
          mat-tab-link
          routerLink="news"
          routerLinkActive
          #news="routerLinkActive"
          [active]="news.isActive"
        >
          {{ 'News' | translate }}
        </nav>
        <nav
          mat-tab-link
          routerLink="schedule"
          routerLinkActive
          #schedule="routerLinkActive"
          [active]="schedule.isActive"
        >
          {{ 'SCHEDULE' | translate }}
        </nav>
        <nav
          mat-tab-link
          routerLink="grades"
          routerLinkActive
          #grades="routerLinkActive"
          [active]="grades.isActive"
        >
          {{ 'GRADES.TITLE' | translate }}
        </nav>
        <nav
          mat-tab-link
          routerLink="files"
          routerLinkActive
          #files="routerLinkActive"
          [active]="files.isActive"
        >
          {{ 'File' | translate }}
        </nav>
        <nav
          mat-tab-link
          routerLink="students"
          routerLinkActive
          #students="routerLinkActive"
          [active]="students.isActive"
        >
          {{ 'Students' | translate }}
        </nav>
      </nav>
      <mat-tab-nav-panel #panel>
        <router-outlet />
      </mat-tab-nav-panel>
    </div>
  `,
})
export class CourseDetailsComponent implements OnInit {
  public readonly courseId = input.required<string>();
  public store = inject(CourseDetailsStore);

  private dialog = inject(MatDialog);

  public ngOnInit(): void {
    this.store.fetchCourse(this.courseId());
  }

  public showMeeting(): void {
    this.dialog.open(CourseMeetingComponent, {
      minWidth: '90vw',
      disableClose: true,
      data: this.store.course(),
    });
  }
}
