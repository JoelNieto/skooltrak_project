import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GroupAssignments, WeekDays } from '@skooltrak/models';
import { getDay } from 'date-fns';

import { ScheduleStore } from './schedule.store';

@Component({
    selector: 'sk-schedule',
    imports: [
        MatButtonModule,
        MatIconModule,
        DatePipe,
        MatChipsModule,
        MatCardModule,
        TranslateModule,
        RouterLink,
    ],
    providers: [ScheduleStore],
    template: `
    <button
      mat-raised-button
      color="primary"
      class="fixed bottom-12 right-12 z-50"
      routerLink="/app/assignments"
    >
      {{ 'CALENDAR.NEW_ASSIGNMENT' | translate }}
    </button>
    <div class="flex w-full justify-evenly mb-3">
      <div class="flex-1"></div>
      <div class="flex flex-1 justify-center gap-4 items-center">
        <button mat-icon-button (click)="store.previousWeek()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="font-mono text-slate-500"
          >{{ store.start() | date: 'd MMM' }} -
          {{ store.end() | date: 'mediumDate' }}</span
        >
        <button mat-icon-button (click)="store.nextWeek()">
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
      <div class="flex-1 flex justify-center">
        @if (!store.isToday()) {
          <button mat-stroked-button (click)="store.goToday()">
            {{ 'CALENDAR.TODAY' | translate }}
          </button>
        }
      </div>
    </div>
    <div
      class="overflow-x-scroll whitespace-nowrap *:w-60 *:max-w-60 *:p-2 *:flex-col border-t border-b rounded-b rounded-t *:gap-3 *:inline-table *:border-r *:overflow-x-scroll [&>*:first-child]:border-l [&>*:first-child]:rounded-tl"
    >
      @for (day of store.days(); track day.day; let idx = $index) {
        <div>
          <div class="flex flex-col w-60 overflow-hidden">
            <div class="text-center mb-2">
              <div class="font-title text-slate-400 text-sm">
                {{ 'WEEK_DAYS.' + WeekDays[idx] | translate }}
              </div>
              <span class="font-mono text-3xl text-sky-900">{{ day.day }}</span>
            </div>
            <div class="h-[60vh] overflow-y-scroll px-2 overflow-x-hidden">
              @for (item of filteredItems(idx); track item) {
                <mat-card>
                  <mat-card-header>
                    <mat-card-title>
                      <a
                        [routerLink]="[
                          '/',
                          'app',
                          'assignments',
                          item.assignment.id
                        ]"
                        class="text-wrap"
                      >
                        {{ item.assignment.title }}
                      </a>
                    </mat-card-title>
                    <mat-card-subtitle>
                      <mat-chip-set
                        ><mat-chip class="primary">{{
                          item.group.name
                        }}</mat-chip>
                        <mat-chip class="tertiary">{{
                          item.assignment.course?.subject?.name
                        }}</mat-chip>
                        <mat-chip
                          >{{ item.assignment.user?.first_name }}
                          {{ item.assignment.user?.father_name }}</mat-chip
                        >
                      </mat-chip-set>
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p
                      class="truncate"
                      [innerHTML]="item.assignment.description"
                    ></p>
                  </mat-card-content>
                </mat-card>
              } @empty {
                <div class="flex items-center justify-center h-full">
                  <h3 class="mat-hint">
                    {{ 'ASSIGNMENTS.EMPTY' | translate }}
                  </h3>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
    styles: `
    mat-card {
      @apply mb-2
    }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent {
  public store = inject(ScheduleStore);
  public course_id = input<string>();
  public WeekDays = WeekDays;

  public weekDay(date: Date): number {
    return getDay(date);
  }

  public filteredItems(idx: number): GroupAssignments {
    return this.store.assignments().filter((x) => this.weekDay(x.date) === idx);
  }
}
