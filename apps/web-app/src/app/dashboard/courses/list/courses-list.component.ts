import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';

import { MatMenuModule } from '@angular/material/menu';
import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { CoursesStore } from '../courses.store';

@Component({
  selector: 'sk-courses-list',
  imports: [
    TranslateModule,
    UserChipComponent,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatMenuModule,
  ],
  providers: [],
  template: `
    <h1 class="mat-display-medium">
      {{ 'COURSES.TITLE' | translate }}
    </h1>

    <div class="flex justify-between">
      <mat-form-field class="w-full lg:w-96">
        <mat-label>{{ 'SEARCH.TITLE' | translate }}</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          id="table-search"
          matInput
          [placeholder]="'SEARCH.PLACEHOLDER' | translate"
        />
      </mat-form-field>
    </div>
    <table
      mat-table
      [dataSource]="dataSource()"
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
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button [matMenuTriggerFor]="menu" mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <a mat-menu-item [routerLink]="['/app/courses', item.id]">
              <mat-icon>visibility</mat-icon>
              {{ 'ACTIONS.DETAILS' | translate }}
            </a>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <mat-paginator
      [length]="store.count()"
      [pageIndex]="store.start()"
      [pageSize]="store.pageSize()"
      [pageSizeOptions]="[5, 10, 15]"
      [showFirstLastButtons]="true"
      (page)="pageEvent($event)"
    />
  `,
})
export class CoursesListComponent {
  public store = inject(CoursesStore);
  public displayedColumns = [
    'subject(name)',
    'plan(year)',
    'teachers',
    'actions',
  ];

  public dataSource = computed(
    () => new MatTableDataSource(this.store.courses()),
  );

  public pageEvent(e: PageEvent): void {
    const { pageIndex, pageSize } = e;
    patchState(this.store, { start: pageIndex, pageSize });
  }

  public sortChange(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }
}
