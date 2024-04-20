import { DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Period } from '@skooltrak/models';

import { SchoolPeriodsFormComponent } from './periods-form.component';
import { SchoolPeriodsStore } from './periods.store';

@Component({
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    DatePipe,
    DialogModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatTableModule,
    MatSortModule,
    MatIconButton,
    MatMenuModule,
  ],
  providers: [SchoolPeriodsStore],
  template: `<div class="relative ">
    <div class="flex justify-between items-baseline px-1">
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

      <button mat-flat-button color="primary" (click)="editPeriod()">
        <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
      </button>
    </div>

    <table
      mat-table
      [dataSource]="store.sortedItems()"
      matSort
      (matSortChange)="sortChange($event)"
    >
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="start_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PERIODS.START_AT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.start_at | date: 'mediumDate' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="end_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PERIODS.END_AT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.end_at | date: 'mediumDate' }}
        </td>
      </ng-container>
      <ng-container matColumnDef="created_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PERIODS.END_AT' | translate }}
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
            <button type="button" mat-menu-item (click)="editPeriod(item)">
              <mat-icon>edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button type="button" mat-menu-item>
              <mat-icon>delete</mat-icon>
              <span>{{ 'ACTIONS.DELETE' | translate }}</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </div>`,
})
export class SchoolPeriodsComponent {
  public store = inject(SchoolPeriodsStore);
  private dialog = inject(MatDialog);
  private containerRef = inject(ViewContainerRef);
  public displayedColumns = [
    'name',
    'start_at',
    'end_at',
    'created_at',
    'actions',
  ];

  public sortChange(sort: Sort): void {
    patchState(this.store, {
      sort_column: sort.active,
      sort_direction: sort.direction,
    });
  }

  public editPeriod(period?: Period): void {
    this.dialog.open(SchoolPeriodsFormComponent, {
      width: '32rem',
      maxWidth: '90vw',
      disableClose: true,
      data: period,
      viewContainerRef: this.containerRef,
    });
  }
}
