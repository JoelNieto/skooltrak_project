import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroEye, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import {
  CardComponent,
  PaginatorComponent,
  TabsComponent,
  TabsItemComponent,
} from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { CoursesStore } from '../courses.store';

@Component({
  standalone: true,
  selector: 'sk-courses-list',
  imports: [
    CardComponent,
    TranslateModule,
    TabsComponent,
    TabsItemComponent,
    NgIconComponent,
    UserChipComponent,
    RouterLink,
    PaginatorComponent,
    DatePipe,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatPrefix,
    MatTableModule,
    MatIconButton,
    MatSortModule,
  ],
  providers: [provideIcons({ heroMagnifyingGlass, heroEye })],
  template: ` <sk-card>
    <div header>
      <h2
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'COURSES.TITLE' | translate }}
      </h2>
    </div>
    <div class="relative">
      <div class="flex justify-between">
        <mat-form-field class="w-full lg:w-96">
          <mat-label for="table-search">Search</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input
            type="text"
            id="table-search"
            matInput
            placeholder="Search for items"
          />
        </mat-form-field>
      </div>
      <table
        mat-table
        [dataSource]="store.courses()"
        matSort
        (matSortChange)="sortChange($event)"
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
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'ACTIONS.TITLE' | translate }}
          </th>
          <td mat-cell *matCellDef="let item">
            <a
              mat-icon-button
              routerLink="../details"
              [queryParams]="{ course_id: item.id }"
            >
              <mat-icon class="text-sky-600">visibility</mat-icon>
            </a>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
      <sk-paginator
        [count]="store.count()"
        (paginate)="getCurrentPage($event)"
      />
    </div>
  </sk-card>`,
})
export class CoursesListComponent {
  public store = inject(CoursesStore);
  public displayedColumns = [
    'subject(name)',
    'plan(year)',
    'teachers',
    'actions',
  ];

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
    pageSize: number;
  }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public sortChange(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }
}
