import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarDateFormatter, CalendarEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DAYS_OF_WEEK, EventColor } from 'calendar-utils';
import { isSameDay, isSameMonth, subDays } from 'date-fns';

import { ButtonDirective } from '../button/button.component';
import { CalendarStore } from './calendar.store';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'sk-calendar',
  standalone: true,
  imports: [
    CalendarModule,
    DialogModule,
    TranslateModule,
    ButtonDirective,
    RouterLink,
    NgIf,
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarDateFormatter,
    provideComponentStore(CalendarStore),
  ],
  template: ` <a
      skButton
      color="green"
      class="fixed bottom-12 right-12 z-50"
      routerLink="/app/courses/assignments"
      [queryParams]="{ course_id: query_value }"
    >
      {{ 'Assignments.New' | translate }}
    </a>
    <div class="mt-4 flex w-full items-center justify-around text-center">
      <div class=" flex-1 rounded-md" role="group">
        <button
          type="button"
          mwlCalendarPreviousView
          [excludeDays]="excludeDays"
          [view]="view"
          [(viewDate)]="viewDate"
          skButton
          color="green"
          class="rounded-e-none"
        >
          {{ 'Calendar.Previous' | translate }}
        </button>
        <button
          type="button"
          skButton
          mwlCalendarToday
          [(viewDate)]="viewDate"
          color="sky"
          class="rounded-none"
        >
          {{ 'Calendar.Today' | translate }}
        </button>
        <button
          type="button"
          skButton
          mwlCalendarNextView
          [excludeDays]="excludeDays"
          [view]="view"
          [(viewDate)]="viewDate"
          color="green"
          class="disabled rounded-s-none"
        >
          {{ 'Calendar.Next' | translate }}
        </button>
      </div>
      <div class="flex-1">
        <h3
          class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
        >
          {{
            viewDate
              | calendarDate
                : view + 'ViewTitle'
                : 'es-PA'
                : weekStartOn
                : excludeDays
          }}
        </h3>
      </div>
      <div class="flex-1 rounded-md" role="group">
        <button
          type="button"
          skButton
          color="purple"
          [disabled]="view === CalendarView.Month"
          class="rounded-e-none"
          (click)="setView(CalendarView.Month)"
        >
          {{ 'Calendar.Month' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-none"
          [disabled]="view === CalendarView.Week"
          (click)="setView(CalendarView.Week)"
        >
          {{ 'Calendar.Week' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-s-none"
          [disabled]="view === CalendarView.Day"
          (click)="setView(CalendarView.Day)"
        >
          {{ 'Calendar.Day' | translate }}
        </button>
      </div>
    </div>
    <div class="p-2">
      <mwl-calendar-month-view
        *ngIf="view === CalendarView.Month"
        [viewDate]="viewDate"
        [events]="events"
        [locale]="locale"
        (dayClicked)="dayClicked($event.day)"
        [activeDayIsOpen]="activeDayIsOpen"
        [weekStartsOn]="weekStartOn"
        [weekendDays]="weekendDays"
      />
      <mwl-calendar-week-view
        *ngIf="view === CalendarView.Week"
        [viewDate]="viewDate"
        [events]="events"
        [locale]="locale"
        [dayStartHour]="7"
        [dayEndHour]="17"
        [weekStartsOn]="weekStartOn"
        [weekendDays]="weekendDays"
      />
      <mwl-calendar-day-view
        *ngIf="view === CalendarView.Day"
        [viewDate]="viewDate"
        [dayStartHour]="7"
        [dayEndHour]="17"
        [events]="events"
        [locale]="locale"
      />
    </div>`,
})
export class CalendarComponent implements OnInit {
  @Input() query_value?: string;
  @Input() query_item: 'course_id' | 'group_id' = 'course_id';
  dialog = inject(Dialog);
  store = inject(CalendarStore);
  router = inject(Router);
  assignments = this.store.assignments;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  weekStartOn = DAYS_OF_WEEK.MONDAY;
  weekendDays = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  excludeDays: number[] = [0, 8];
  locale = 'es-PA';
  events: CalendarEvent[] = [
    {
      start: subDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen = true;

  constructor() {
    effect(() => console.info(this.assignments()));
  }

  ngOnInit(): void {
    this.store.patchState({
      query_item: 'course_id',
      query_value: '4a5e402a-3fe2-4630-b2b5-5c33466df146',
    });
    console.info(this.query_value);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
}
