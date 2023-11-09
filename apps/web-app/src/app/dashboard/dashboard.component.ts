import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightOnRectangle,
  heroBookmarkSquare,
  heroBookOpen,
  heroBuildingLibrary,
  heroCalendarDays,
  heroClipboardDocument,
  heroCog6Tooth,
  heroHome,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';

import { AvatarComponent } from '../components/avatar/avatar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { SchoolSelectorComponent } from '../components/school-selector/school-selector.component';

@Component({
  selector: 'sk-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    AvatarComponent,
    NgIconComponent,
    TranslateModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  providers: [
    provideIcons({
      heroHome,
      heroArrowRightOnRectangle,
      heroBookmarkSquare,
      heroClipboardDocument,
      heroCalendarDays,
      heroUserGroup,
      heroBuildingLibrary,
      heroCog6Tooth,
      heroBookOpen,
    }),
  ],
  template: `<sk-navbar />
    <nav
      class="sticky top-[4rem] z-10 flex w-full items-center justify-between border-b border-gray-200 bg-white px-12 dark:border-gray-500 dark:bg-gray-700"
    >
      <ul class="flex gap-8">
        <li>
          <a routerLink="home" class="link" routerLinkActive="active"
            ><ng-icon name="heroHome" size="24" />{{ 'HOME' | translate }}</a
          >
        </li>
        <li>
          <a routerLink="courses" class="link" routerLinkActive="active"
            ><ng-icon name="heroBookOpen" size="24" />{{
              'COURSES.TITLE' | translate
            }}</a
          >
        </li>
        <li>
          <a routerLink="groups" class="link" routerLinkActive="active"
            ><ng-icon name="heroUserGroup" size="24" />{{
              'GROUPS.TITLE' | translate
            }}</a
          >
        </li>
      </ul>
      <div>
        <ul class="flex text-sm">
          <li>
            <button
              class="flex w-full items-center gap-3 rounded-lg px-4 py-2 font-sans text-sm dark:text-gray-100"
              (click)="changeSchool()"
            >
              @if(SCHOOL()?.crest_url) {
              <sk-avatar
                [avatarUrl]="SCHOOL()?.crest_url!"
                bucket="crests"
                class="h-8"
              />
              }
              {{ SCHOOL()?.short_name ?? ('Select school' | translate) }}
            </button>
          </li>
          @if(IS_ADMIN()) {
          <li>
            <a routerLink="school" class="link" routerLinkActive="active"
              ><ng-icon name="heroBuildingLibrary" size="24" />{{
                'SCHOOL.TITLE' | translate
              }}</a
            >
          </li>
          }

          <li>
            <a href="#" class="link">
              <ng-icon name="heroArrowRightOnRectangle" size="24" />{{
                'SIGN_OUT' | translate
              }}</a
            >
          </li>
        </ul>
      </div>
    </nav>
    <main
      class="relative mt-[4rem] flex flex-col items-center bg-slate-50 p-8 font-sans dark:bg-gray-900"
    >
      <div class="w-full max-w-7xl">
        <router-outlet />
      </div>
    </main> `,
  styles: [
    `
      main,
      aside {
        min-height: calc(100vh - 4rem);
      }

      .link {
        @apply mt-1 flex items-center gap-3 border-b-4 border-white px-4 py-3 font-sans text-gray-500 hover:text-gray-700 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white;
        &.active {
          @apply border-emerald-600 text-emerald-800 dark:text-emerald-500;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private auth = inject(authState.AuthStateFacade);
  private dialog = inject(Dialog);

  public USER = this.auth.USER;
  public SCHOOL = this.auth.CURRENT_SCHOOL;
  public IS_ADMIN = this.auth.IS_ADMIN;

  public changeSchool(): void {
    this.dialog.open(SchoolSelectorComponent, {
      width: '36rem',
      maxWidth: '90%',
    });
  }
}
