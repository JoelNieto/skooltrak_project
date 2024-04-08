import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'sk-school',
  imports: [
    RouterOutlet,
    TranslateModule,
    MatTabsModule,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <h1 class="mat-headline-3">
      {{ 'SCHOOL.ADMINISTRATION' | translate }}
    </h1>

    <nav mat-tab-nav-bar [tabPanel]="panel">
      <a
        mat-tab-link
        routerLink="info"
        routerLinkActive
        #info="routerLinkActive"
        [active]="info.isActive"
        >{{ 'SCHOOL.INFO' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="courses"
        routerLinkActive
        #courses="routerLinkActive"
        [active]="courses.isActive"
        >{{ 'COURSES.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="plans"
        routerLinkActive
        #plans="routerLinkActive"
        [active]="plans.isActive"
        >{{ 'PLANS.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="subjects"
        routerLinkActive
        #subjects="routerLinkActive"
        [active]="subjects.isActive"
        >{{ 'SUBJECTS.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="degrees"
        routerLinkActive
        #degrees="routerLinkActive"
        [active]="degrees.isActive"
        >{{ 'DEGREES.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="groups"
        routerLinkActive
        #groups="routerLinkActive"
        [active]="groups.isActive"
        >{{ 'GROUPS.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="periods"
        routerLinkActive
        #periods="routerLinkActive"
        [active]="periods.isActive"
        >{{ 'PERIODS.TITLE' | translate }}</a
      >
      <a
        mat-tab-link
        routerLink="people"
        routerLinkActive
        #people="routerLinkActive"
        [active]="people.isActive"
        >{{ 'PEOPLE.TITLE' | translate }}</a
      >
    </nav>
    <mat-tab-nav-panel #panel>
      <div class="p-4">
        <router-outlet />
      </div>
    </mat-tab-nav-panel>
  `,
})
export class SchoolComponent {}
