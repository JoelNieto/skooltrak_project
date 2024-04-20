import { DatePipe } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';

import { StudyPlansFormComponent } from './plans-form.component';
import { SchoolPlansStore } from './plans.store';

@Component({
  selector: 'sk-school-study-plans',
  standalone: true,
  imports: [
    TranslateModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatIconButton,
    MatMenuModule,
    MatSortModule,
  ],
  providers: [SchoolPlansStore, ConfirmationService],
  template: `<div class="relative ">
    <div class="flex justify-between items-baseline px-1">
      <mat-form-field class="w-full lg:w-72 ">
        <mat-label for="table-search">Search</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          id="table-search"
          placeholder="Search for items"
          matInput
        />
      </mat-form-field>
      <button mat-flat-button color="primary" (click)="editPlan()">
        <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
      </button>
    </div>
    <table
      mat-table
      [dataSource]="store.plans()"
      matSort
      (matSortChange)="changeSort($event)"
    >
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PLANS.NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="level(name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PLANS.LEVEL' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.level.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="degree(name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PLANS.DEGREE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.degree.name }}
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
            <button mat-menu-item (click)="editPlan(item)">
              <mat-icon color="accent">edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button mat-menu-item (click)="deletePlan(item.id)">
              <mat-icon color="warn">delete</mat-icon>
              <span>{{ 'ACTIONS.DELETE' | translate }}</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCols"></tr>
    </table>

    <mat-paginator
      [length]="store.count()"
      [pageIndex]="store.start()"
      [pageSize]="store.pageSize()"
      [pageSizeOptions]="[5, 10, 15]"
      [showFirstLastButtons]="true"
      (page)="pageEvent($event)"
    />
  </div>`,
})
export class StudyPlansComponent {
  public store = inject(SchoolPlansStore);
  private dialog = inject(MatDialog);
  private containerRef = inject(ViewContainerRef);

  public displayedCols = [
    'name',
    'level(name)',
    'degree(name)',
    'created_at',
    'actions',
  ];

  public pageEvent(e: PageEvent): void {
    const { pageIndex, pageSize } = e;
    patchState(this.store, { start: pageIndex, pageSize });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }

  public editPlan(plan?: StudyPlan): void {
    this.dialog.open(StudyPlansFormComponent, {
      minWidth: '36rem',
      disableClose: true,
      data: plan,
      viewContainerRef: this.containerRef,
    });
  }

  public deletePlan(id: string): void {
    this.store.deletePlan(id);
  }
}
