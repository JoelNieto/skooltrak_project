import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { WeekDays } from '@skooltrak/models';

import { ScheduleStore } from './schedule.store';

@Component({
  selector: 'sk-schedule',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    DatePipe,
    MatCardModule,
    TranslateModule,
    RouterLink,
  ],
  providers: [ScheduleStore],
  template: `
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
      class="overflow-x-scroll whitespace-nowrap *:w-60 *:max-w-60 *:p-2 *:flex-col border-t border-b rounded-b rounded-t *:gap-3 *:inline-table  *:border-r max-h-[60vh] *:max-h-[60vh] *:overflow-y-scroll *:overflow-x-scroll [&>*:first-child]:border-l [&>*:first-child]:rounded-tl"
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
            @for (item of store.assignments(); track item) {
              <mat-card>
                <mat-card-header>
                  <mat-card-title
                    [routerLink]="['/app/assignments', item.assignment.id]"
                    >{{ item.assignment.title }}</mat-card-title
                  >
                </mat-card-header>
                <mat-card-content>
                  <p [innerHTML]="item.assignment.description"></p>
                </mat-card-content>
              </mat-card>
            }
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
  public store = inject(ScheduleStore);
  public WeekDays = WeekDays;

  public ngOnInit(): void {
    this.store.getAssignments();
  }
}
