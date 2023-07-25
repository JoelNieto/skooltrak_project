import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Assignment } from '@skooltrak/models';
import { CalendarDateFormatter, CalendarEvent, CalendarModule, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DAYS_OF_WEEK, EventColor } from 'calendar-utils';
import { addDays, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';

import { AssignmentFormComponent } from '../assignment-form/assignment-form.component';
import { ButtonDirective } from '../button/button.component';

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
    NgIf,
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarDateFormatter,
  ],
  template: ` <button
      skButton
      color="green"
      class="fixed bottom-12 right-12"
      (click)="newAssignment()"
    >
      {{ 'Assignments.New' | translate }}
    </button>
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
          {{ 'Previous' | translate }}
        </button>
        <button
          type="button"
          skButton
          mwlCalendarToday
          [(viewDate)]="viewDate"
          color="sky"
          class="rounded-none"
        >
          {{ 'Today' | translate }}
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
          {{ 'Next' | translate }}
        </button>
      </div>
      <div class="flex-1">
        <h3 class="font-title text-xl font-semibold text-gray-700">
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
          {{ 'Month' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-none"
          [disabled]="view === CalendarView.Week"
          (click)="setView(CalendarView.Week)"
        >
          {{ 'Week' | translate }}
        </button>
        <button
          type="button"
          skButton
          color="purple"
          class="rounded-s-none"
          [disabled]="view === CalendarView.Day"
          (click)="setView(CalendarView.Day)"
        >
          {{ 'Day' | translate }}
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
        [excludeDays]="excludeDays"
        [weekendDays]="weekendDays"
      />
      <mwl-calendar-week-view
        *ngIf="view === CalendarView.Week"
        [viewDate]="viewDate"
        [events]="events"
        [locale]="locale"
        [weekStartsOn]="weekStartOn"
        [excludeDays]="excludeDays"
        [weekendDays]="weekendDays"
      />
      <mwl-calendar-day-view
        *ngIf="view === CalendarView.Day"
        [viewDate]="viewDate"
        [events]="events"
        [locale]="locale"
      />
    </div>`,
})
export class CalendarComponent {
  dialog = inject(Dialog);
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  weekStartOn = DAYS_OF_WEEK.MONDAY;
  weekendDays = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  excludeDays: number[] = [0, 6];
  locale = 'es-PA';
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen = true;

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

  newAssignment() {
    const dialogRef = this.dialog.open<Partial<Assignment>>(
      AssignmentFormComponent,
      {
        minWidth: '55%',
        maxWidth: '55rem',
        disableClose: true,
      }
    );

    dialogRef.closed.subscribe({
      next: (request) => {
        console.info(request);
      },
    });
  }
}
