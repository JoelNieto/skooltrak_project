import { DialogModule } from '@angular/cdk/dialog';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentView } from '@skooltrak/models';
import { ButtonDirective } from '@skooltrak/ui';
import { CalendarDateFormatter, CalendarEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DAYS_OF_WEEK } from 'calendar-utils';
import { endOfDay, endOfMonth, endOfWeek, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from 'date-fns';

import { CalendarStore } from './calendar.store';

@Component({
  selector: 'sk-calendar',
  standalone: true,
  imports: [
    CalendarModule,
    DialogModule,
    TranslateModule,
    ButtonDirective,
    RouterLink,
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarDateFormatter,
    CalendarStore,
  ],
  template: ` <a
      skButton
      color="green"
      class="fixed bottom-12 right-12 z-50"
      routerLink="/app/courses/assignments"
      [queryParams]="{ course_id: queryValue }"
    >
      {{ 'CALENDAR.NEW_ASSIGNMENT' | translate }}
    </a>
    <div class="my-4 flex w-full items-center justify-around text-center">
      <div class=" flex flex-1 rounded-md" role="group">
        <button
          type="button"
          mwlCalendarPreviousView
          [excludeDays]="excludeDays"
          [view]="view"
          [(viewDate)]="viewDate"
          (viewDateChange)="fetchEvents()"
          skButton
          color="green"
          class="rounded-e-none"
        >
          {{ 'CALENDAR.PREVIOUS' | translate }}
        </button>
        <button
          type="button"
          skButton
          mwlCalendarToday
          [(viewDate)]="viewDate"
          color="sky"
          class="rounded-none"
          (viewDateChange)="fetchEvents()"
        >
          {{ 'CALENDAR.TODAY' | translate }}
        </button>
        <button
          type="button"
          skButton
          mwlCalendarNextView
          [excludeDays]="excludeDays"
          [view]="view"
          [(viewDate)]="viewDate"
          (viewDateChange)="fetchEvents()"
          color="green"
          class="disabled rounded-s-none"
        >
          {{ 'CALENDAR.NEXT' | translate }}
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
      <div class="flex flex-1 justify-end rounded-md" role="group">
        <button
          type="button"
          skButton
          color="purple"
          [disabled]="view === CalendarView.Month"
          class="rounded-e-none"
          (click)="setView(CalendarView.Month)"
        >
          {{ 'CALENDAR.MONTH' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-none"
          [disabled]="view === CalendarView.Week"
          (click)="setView(CalendarView.Week)"
        >
          {{ 'CALENDAR.WEEK' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-s-none"
          [disabled]="view === CalendarView.Day"
          (click)="setView(CalendarView.Day)"
        >
          {{ 'CALENDAR.DAY' | translate }}
        </button>
      </div>
    </div>
    <div class="p-2">
      @switch (view) {
        @case (CalendarView.Month) {
          <mwl-calendar-month-view
            [viewDate]="viewDate"
            [events]="this.store.assignments()"
            [locale]="locale"
            (dayClicked)="dayClicked($event.day)"
            [activeDayIsOpen]="activeDayIsOpen"
            [weekStartsOn]="weekStartOn"
            [weekendDays]="weekendDays"
            (eventClicked)="eventClicked($event.event)"
          />
        }
        @case (CalendarView.Week) {
          <mwl-calendar-week-view
            [viewDate]="viewDate"
            [events]="this.store.assignments()"
            [locale]="locale"
            [dayStartHour]="7"
            [dayEndHour]="17"
            [weekStartsOn]="weekStartOn"
            [weekendDays]="weekendDays"
            (eventClicked)="eventClicked($event.event)"
          />
        }
        @case (CalendarView.Day) {
          <mwl-calendar-day-view
            [viewDate]="viewDate"
            [dayStartHour]="7"
            [dayEndHour]="17"
            [events]="this.store.assignments()"
            [locale]="locale"
            (eventClicked)="eventClicked($event.event)"
          />
        }
      }
    </div>`,
})
export class CalendarComponent implements OnInit {
  @Input() public queryValue?: string;
  @Input() public queryItem: 'course_id' | 'group_id' = 'course_id';
  public store = inject(CalendarStore);
  private router = inject(Router);
  public assignments = this.store.assignments;
  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;

  public viewDate: Date = new Date();
  public weekStartOn = DAYS_OF_WEEK.MONDAY;
  public weekendDays = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  public excludeDays: number[] = [0, 8];
  public locale = 'es-PA';
  public events: CalendarEvent[] = this.store.assignments();

  public activeDayIsOpen = true;

  public ngOnInit(): void {
    patchState(this.store, {
      queryItem: this.queryItem,
      queryValue: this.queryValue,
    });
  }

  public fetchEvents(): void {
    this.closeOpenMonthViewDay();
    const getStart = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    patchState(this.store, {
      startDate: getStart(this.viewDate),
      endDate: getEnd(this.viewDate),
    });
  }

  public setView(view: CalendarView): void {
    this.view = view;
    this.fetchEvents();
  }

  public dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {
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

  public closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  public eventClicked(
    event: CalendarEvent<{ assignment: AssignmentView }>,
  ): void {
    this.router.navigate(['app', 'courses', 'assignments', event.id]);
  }
}
