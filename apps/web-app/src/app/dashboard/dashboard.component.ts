import { Dialog } from '@angular/cdk/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';
import { filter, tap } from 'rxjs';

import { AvatarComponent } from '../components/avatar/avatar.component';
import { SchoolSelectorComponent } from '../components/school-selector/school-selector.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'sk-dashboard',
    imports: [
        AvatarComponent,
        TranslateModule,
        RouterOutlet,
        NgClass,
        RouterLink,
        RouterLinkActive,
        MatListModule,
        MatMenuModule,
        MatIconModule,
        MatSnackBarModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        NgOptimizedImage,
        MatTooltipModule,
    ],
    providers: [],
    template: `
    @if (isMobile()) {
      <mat-toolbar>
        <div class="flex items-center">
          <button aria-label="Menu icon" mat-icon-button (click)="toggleMenu()">
            <mat-icon>menu</mat-icon>
          </button>
          <a routerLink="home">
            <img
              src="assets/images/skooltrak.svg"
              class="ml-3 h-7"
              alt="Skooltrak Logo"
            />
          </a>
        </div>
      </mat-toolbar>
    }
    <mat-sidenav-container autosize class="h-full">
      <mat-sidenav
        class="main-sidenav border border-slate-300"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [ngClass]="isCollapsed() ? 'w-20' : 'w-56'"
      >
        <div
          class="flex flex-col justify-between h-screen pt-4 pb-4 px-2 pr-3 "
        >
          <div>
            <div
              class="flex w-full justify-between  gap-2 ps-2"
              [class.flex-col]="isCollapsed()"
            >
              <button mat-icon-button (click)="toggleMenu()">
                <mat-icon>menu</mat-icon>
              </button>
              <img src="assets/images/skooltrak-logo-square.svg" class="h-10" />
            </div>

            @if (auth.user(); as user) {
              <div
                class="flex flex-col items-center p-3 cursor-pointer"
                [matMenuTriggerFor]="menu"
              >
                <sk-avatar
                  [fileName]="user.avatar_url"
                  bucket="avatars"
                  [rounded]="true"
                  class="h-10 w-10"
                />
                @if (!isCollapsed()) {
                  <p class="mat-title-medium">
                    {{ user.first_name }} {{ user.father_name }}
                  </p>
                  <p class="mat-title-small">{{ user.email }}</p>
                }
              </div>
              <button
                mat-stroked-button
                (click)="changeSchool()"
                class="w-full"
              >
                @if (isCollapsed()) {
                  <mat-icon>home_work</mat-icon>
                } @else {
                  @if (auth.currentSchool(); as school) {
                    <div class="flex items-center gap-2">
                      @if (school.crest_url) {
                        <sk-avatar
                          [fileName]="auth.currentSchool()?.crest_url!"
                          bucket="crests"
                          class="h-8"
                        />
                      } @else {
                        <img
                          ngSrc="assets/images/skooltrak-logo.svg"
                          class="h-8"
                          alt="Skooltrak Logo"
                        />
                      }
                      {{ school?.short_name ?? ('Select school' | translate) }}
                    </div>
                  }
                }
              </button>
              <mat-menu #menu="matMenu">
                <a mat-menu-item routerLink="profile">
                  <mat-icon>account_circle</mat-icon>
                  {{ 'PROFILE.TITLE' | translate }}</a
                >
                <a mat-menu-item routerLink="communications">
                  <mat-icon>chat</mat-icon>
                  {{ 'MESSAGING.TITLE' | translate }}</a
                >
                <a mat-menu-item routerLink="change-password">
                  <mat-icon>password</mat-icon>
                  {{ 'CHANGE_PASSWORD.TITLE' | translate }}</a
                >
                <button mat-menu-item (click)="logout()">
                  <mat-icon>logout</mat-icon>
                  {{ 'AUTH.LOGOUT' | translate }}
                </button>
              </mat-menu>
            }
            <mat-nav-list>
              <a
                mat-list-item
                routerLink="home"
                routerLinkActive="active"
                #home="routerLinkActive"
                [activated]="home.isActive"
                [matTooltip]="'HOME' | translate"
                [matTooltipPosition]="'right'"
              >
                <mat-icon matListItemIcon>house</mat-icon>
                @if (!isCollapsed()) {
                  <div matListItemTitle>{{ 'HOME' | translate }}</div>
                }
              </a>
              <a
                mat-list-item
                routerLink="schedule"
                routerLinkActive="active"
                #schedule="routerLinkActive"
                [activated]="schedule.isActive"
                [matTooltip]="'SCHEDULE' | translate"
                [matTooltipPosition]="'right'"
              >
                <mat-icon matListItemIcon>calendar_month</mat-icon>
                @if (!isCollapsed()) {
                  <div matListItemTitle>{{ 'SCHEDULE' | translate }}</div>
                }
              </a>
              <a
                mat-list-item
                routerLink="courses"
                routerLinkActive="active"
                #courses="routerLinkActive"
                [activated]="courses.isActive"
                [matTooltip]="'COURSES.TITLE' | translate"
                [matTooltipPosition]="'right'"
              >
                <mat-icon matListItemIcon>dvr</mat-icon>
                @if (!isCollapsed()) {
                  <div matListItemTitle>{{ 'COURSES.TITLE' | translate }}</div>
                }
              </a>
              <a
                mat-list-item
                routerLink="quizzes"
                routerLinkActive="active"
                #quizzes="routerLinkActive"
                [activated]="quizzes.isActive"
                [matTooltip]="'QUIZZES.TITLE' | translate"
                [matTooltipPosition]="'right'"
              >
                <mat-icon matListItemIcon>quiz</mat-icon>
                @if (!isCollapsed()) {
                  <div matListItemTitle>{{ 'QUIZZES.TITLE' | translate }}</div>
                }
              </a>
            </mat-nav-list>
          </div>

          <mat-nav-list>
            @if (auth.isAdmin()) {
              <a
                mat-list-item
                routerLink="school"
                routerLinkActive="active"
                #school="routerLinkActive"
                [activated]="school.isActive"
                [matTooltip]="'SCHOOL.TITLE' | translate"
                [matTooltipPosition]="'right'"
              >
                <mat-icon matListItemIcon>domain</mat-icon>
                <div matListItemTitle>{{ 'SCHOOL.TITLE' | translate }}</div>
              </a>
            }
          </mat-nav-list>
        </div>
      </mat-sidenav>
      <mat-sidenav-content>
        <main>
          <div class="mx-auto p-4 xl:p-6">
            <router-outlet />
          </div>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  public auth = inject(webStore.AuthStore);
  private dialog = inject(Dialog);
  private sidenav = viewChild.required(MatSidenav);
  private observer = inject(BreakpointObserver);
  public isMobile = signal(true);
  public isCollapsed = signal(true);
  private confirmation = inject(ConfirmationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  public ngOnInit(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe({
      next: (screenSize) => {
        this.isMobile.set(screenSize.matches);
      },
    });
  }

  public changeSchool(): void {
    this.dialog.open(SchoolSelectorComponent, {
      width: '38rem',
      maxWidth: '90%',
    });
  }

  public toggleMenu(): void {
    if (this.isMobile()) {
      this.sidenav().toggle();
      this.isCollapsed.set(false);

      return;
    }
    this.sidenav().open();
    this.isCollapsed.update((value) => !value);
  }

  public logout(): void {
    this.confirmation
      .openDialog({ title: 'AUTH.LOGOUT_QUESTION', showCancelButton: true })
      .pipe(
        filter((res) => !!res),
        tap(() =>
          this.snackBar.open(this.translate.instant('AUTH.LOGGED_OUT')),
        ),
      )
      .subscribe({ next: () => this.router.navigate(['/']) });
  }
}
