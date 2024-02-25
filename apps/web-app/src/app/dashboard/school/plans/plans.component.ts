import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { StudyPlan } from '@skooltrak/models';
import {
  ConfirmationService,
  EmptyTableComponent,
  LoadingComponent,
  PaginatorComponent,
} from '@skooltrak/ui';

import { StudyPlansFormComponent } from './plans-form.component';
import { SchoolPlansStore } from './plans.store';

@Component({
  selector: 'sk-school-study-plans',
  standalone: true,
  imports: [
    TranslateModule,
    PaginatorComponent,
    DatePipe,
    DialogModule,
    MatButton,
    LoadingComponent,
    EmptyTableComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatPrefix,
    MatIcon,
    MatTableModule,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
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
      <button mat-flat-button color="primary" (click)="newStudyPlan()">
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
            <button mat-menu-item (click)="editStudyPlan(item)">
              <mat-icon color="accent">edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button mat-menu-item (click)="deletePlan(item)">
              <mat-icon color="warn">delete</mat-icon>
              <span>{{ 'ACTIONS.DELETE' | translate }}</span>
            </button>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCols"></tr>
    </table>

    <sk-paginator [count]="store.count()" (paginate)="getCurrentPage($event)" />
  </div>`,
})
export class StudyPlansComponent {
  public store = inject(SchoolPlansStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroy = inject(DestroyRef);
  public displayedCols = [
    'name',
    'level(name)',
    'degree(name)',
    'created_at',
    'actions',
  ];

  public getCurrentPage(pagination: { start: number; pageSize: number }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }

  public newStudyPlan(): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      },
    );

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.savePlan(request);
      },
    });
  }

  public editStudyPlan(plan: StudyPlan): void {
    const dialogRef = this.dialog.open<Partial<StudyPlan>>(
      StudyPlansFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: plan,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.savePlan({ ...request, id: plan.id });
      },
    });
  }

  public deletePlan(plan: StudyPlan): void {
    const { id } = plan;

    if (!id) return;

    this.confirmation
      .openDialog({
        title: 'CONFIRMATION.DELETE.TITLE',
        description: 'CONFIRMATION.DELETE.TEXT',
        icon: 'delete',
        color: 'warn',
        confirmButtonText: 'CONFIRMATION.DELETE.CONFIRM',
        cancelButtonText: 'CONFIRMATION.DELETE.CANCEL',
        showCancelButton: true,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => !!res && this.store.deletePlan(id),
      });
  }
}
