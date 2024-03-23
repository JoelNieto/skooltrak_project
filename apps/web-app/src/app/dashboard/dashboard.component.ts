import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';

import { AvatarComponent } from '../components/avatar/avatar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SchoolSelectorComponent } from '../components/school-selector/school-selector.component';

@Component({
  selector: 'sk-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    AvatarComponent,
    TranslateModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIcon,
  ],
  providers: [],
  template: `<sk-navbar />
    <nav
      class="sticky top-[4rem] z-10 flex w-full items-center justify-between border-b border-gray-200 bg-white px-12 dark:border-gray-600 dark:bg-gray-700"
    >
      <ul class="flex gap-8">
        <li>
          <a
            routerLink="home"
            class="link"
            routerLinkActive="active"
            #home="routerLinkActive"
            ><mat-icon [color]="home.isActive ? 'primary' : ''">house</mat-icon>
            {{ 'HOME' | translate }}</a
          >
        </li>
        <li>
          <a
            routerLink="schedule"
            class="link"
            routerLinkActive="active"
            #schedule="routerLinkActive"
            ><mat-icon [color]="schedule.isActive ? 'primary' : ''"
              >calendar_month</mat-icon
            >{{ 'SCHEDULE' | translate }}</a
          >
        </li>
        <li>
          <a
            routerLink="courses"
            class="link"
            routerLinkActive="active"
            #courses="routerLinkActive"
            ><mat-icon [color]="courses.isActive ? 'primary' : ''">dvr</mat-icon
            >{{ 'COURSES.TITLE' | translate }}</a
          >
        </li>
        <li>
          <a
            routerLink="quizzes"
            class="link"
            routerLinkActive="active"
            #quizzes="routerLinkActive"
            ><mat-icon [color]="quizzes.isActive ? 'primary' : ''"
              >quiz</mat-icon
            >{{ 'QUIZZES.TITLE' | translate }}</a
          >
        </li>
      </ul>
      <div>
        <ul class="flex text-sm items-center">
          <li>
            <button
              class="flex w-full items-center gap-3 rounded-lg px-4 py-2 font-sans text-sm dark:text-gray-100"
              (click)="changeSchool()"
            >
              @if (auth.currentSchool()?.crest_url) {
                <sk-avatar
                  [fileName]="auth.currentSchool()?.crest_url!"
                  bucket="crests"
                  class="h-8"
                />
              }
              {{
                auth.currentSchool()?.short_name ??
                  ('Select school' | translate)
              }}
            </button>
          </li>
          @if (auth.isAdmin()) {
            <li>
              <a routerLink="school" class="link" routerLinkActive="active"
                ><mat-icon>domain</mat-icon>{{ 'SCHOOL.TITLE' | translate }}</a
              >
            </li>
          }
          <li>
            <button class="link" (click)="auth.signOut()">
              <mat-icon>logout</mat-icon>{{ 'SIGN_OUT.TITLE' | translate }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <main
      class="relative mt-[4rem] flex flex-col items-center bg-white p-8 font-sans dark:bg-gray-900"
    >
      <div class="w-full max-w-7xl">
        <router-outlet />
      </div>
    </main> `,
  styles: [
    `
      main {
        min-height: calc(100vh - 8rem);
      }

      .link {
        @apply mt-1 flex items-center gap-3 border-b-4 border-white px-4 py-3 font-sans text-gray-500 hover:text-gray-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white;
        &.active {
          @apply border-sky-600 text-gray-800 dark:text-gray-500;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public auth = inject(webStore.AuthStore);
  private dialog = inject(Dialog);

  public changeSchool(): void {
    this.dialog.open(SchoolSelectorComponent, {
      width: '38rem',
      maxWidth: '90%',
    });
  }
}
