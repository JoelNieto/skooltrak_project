import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatFormField,
  MatLabel,
  MatSelectModule,
} from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { PaginatorComponent, UtilService } from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolCoursesFormComponent } from './courses-form.component';
import { SchoolCoursesStore } from './courses.store';

@Component({
  selector: 'sk-school-courses',
  standalone: true,
  imports: [
    TranslateModule,
    UserChipComponent,
    PaginatorComponent,
    DatePipe,
    RouterLink,
    MatSelectModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatTableModule,
    MatIcon,
    MatIconButton,
    MatSortModule,
    MatMenuModule,
    MatButton,
  ],
  providers: [UtilService, SchoolCoursesStore],
  template: ` <div class="relative ">
    <div class="flex flex-nowrap justify-between items-baseline gap-4 px-1">
      <mat-form-field class="w-96">
        <mat-label>{{ 'COURSES.SELECT_PLAN' | translate }}</mat-label>
        <mat-select
          [formControl]="planControl"
          [placeholder]="'COURSES.PLAN' | translate"
        >
          @for (degree of store.degrees(); track degree.id) {
            <mat-optgroup [label]="degree.name!">
              @for (plan of degree.plans; track plan.id) {
                <mat-option [value]="plan.id">{{ plan.name }}</mat-option>
              }
            </mat-optgroup>
          }
        </mat-select>
      </mat-form-field>
      <button mat-flat-button color="primary" (click)="createCourse()">
        <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
      </button>
    </div>
    <table
      mat-table
      [dataSource]="store.courses()"
      matSort
      (matSortChange)="changeSort($event)"
    >
      <ng-container matColumnDef="subject(name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'COURSES.SUBJECT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.subject?.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="plan(year)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'COURSES.PLAN' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.plan?.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="teachers">
        <th mat-header-cell *matHeaderCellDef>
          {{ 'COURSES.TEACHERS' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          <div class="flex gap-1">
            @for (teacher of item.teachers; track teacher.id) {
              <sk-user-chip [user]="teacher" />
            }
          </div>
        </td>
      </ng-container>
      <ng-container matColumnDef="created_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'CREATED_AT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.created_at | date: 'medium' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a
              mat-menu-item
              routerLink="../../courses/details"
              [queryParams]="{ course_id: item.id }"
            >
              <mat-icon color="primary">visibility</mat-icon>
              <span>{{ 'ACTIONS.DETAILS' | translate }}</span>
            </a>
            <button type="button" mat-menu-item (click)="editCourse(item)">
              <mat-icon color="accent">edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <sk-paginator [count]="store.count()" (paginate)="getCurrentPage($event)" />
  </div>`,
})
export class SchoolCoursesComponent implements OnInit {
  public store = inject(SchoolCoursesStore);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);
  public displayedColumns = [
    'subject(name)',
    'plan(year)',
    'teachers',
    'created_at',
    'actions',
  ];

  public planControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  public ngOnInit(): void {
    this.planControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (planId) => patchState(this.store, { planId }),
      });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }

  public getCurrentPage(pagination: { pageSize: number; start: number }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public createCourse(): void {
    this.dialog
      .open<{ course: Partial<Course>; teachers: string[] }>(
        SchoolCoursesFormComponent,
        {
          width: '36rem',
          maxWidth: '75%',
          disableClose: true,
          data: { plan_id: this.store.planId() },
        },
      )
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          if (!request) {
            return;
          }
          const { course } = request;
          !!course && this.store.saveCourse(course);
        },
      });
  }

  public editCourse(item: Partial<Course>): void {
    this.dialog
      .open<{ course: Partial<Course>; teachers: string[] }>(
        SchoolCoursesFormComponent,
        {
          width: '36rem',
          maxWidth: '75%',
          disableClose: true,
          data: item,
        },
      )
      .closed.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (request) => {
          if (request) {
            const { course } = request;
            !!course && this.store.saveCourse({ ...course, id: item.id });
          }
        },
      });
  }

  public deleteCourse(course: Course): void {
    const { id } = course;

    if (!id) return;
  }
}
