import { Dialog } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
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
    NgIf,
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
    <aside
      id="sidebar-multi-level-sidebar"
      class="fixed left-0 top-[4rem] z-40 flex w-64 -translate-x-full flex-col justify-between p-4 transition-transform sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div class="h-full overflow-y-auto rounded-lg px-3 dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
          <li>
            <button
              class="flex w-full items-center gap-3 rounded-lg border border-emerald-600 px-4 py-2 font-sans text-sm dark:text-gray-100"
              (click)="changeSchool()"
            >
              <sk-avatar
                *ngIf="SCHOOL()?.crest_url"
                [avatarUrl]="SCHOOL()?.crest_url!"
                bucket="crests"
                class="h-8"
              />{{ SCHOOL()?.short_name ?? ('Select school' | translate) }}
            </button>
          </li>
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
      </div>
      <div>
        <ul class="space-y-1 text-sm">
          <li *ngIf="IS_ADMIN()">
            <a routerLink="school" class="link" routerLinkActive="active"
              ><ng-icon name="heroBuildingLibrary" size="24" />{{
                'SCHOOL.TITLE' | translate
              }}</a
            >
          </li>
          <li>
            <a routerLink="settings" routerLinkActive="active" class="link"
              ><ng-icon name="heroCog6Tooth" size="24" />{{
                'SETTINGS' | translate
              }}</a
            >
          </li>
          <li>
            <a href="#" routerLinkActive="active" class="link">
              <ng-icon name="heroArrowRightOnRectangle" size="24" />{{
                'SIGN_OUT' | translate
              }}</a
            >
          </li>
        </ul>
      </div>
    </aside>
    <main
      class="relative top-[4rem] flex flex-col items-center rounded-tl-3xl bg-slate-50 p-8 font-sans dark:bg-gray-900 sm:ml-64"
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
        @apply flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white;
        &.active {
          @apply bg-emerald-200 text-emerald-800;
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
