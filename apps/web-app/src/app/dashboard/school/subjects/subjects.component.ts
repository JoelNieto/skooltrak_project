import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { ButtonDirective, ConfirmationService, PaginatorComponent } from '@skooltrak/ui';
import { debounceTime } from 'rxjs';

import { SubjectsFormComponent } from './subjects-form.component';
import { SchoolSubjectsStore } from './subjects.store';

@Component({
  selector: 'sk-school-subjects',
  standalone: true,
  imports: [
    ButtonDirective,
    PaginatorComponent,
    DialogModule,
    NgClass,
    SubjectsFormComponent,
    DatePipe,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatPrefix,
    MatIcon,
    MatTableModule,
    MatSortModule,
    MatIconButton,
  ],
  providers: [SchoolSubjectsStore, ConfirmationService],
  template: `<div class="relative ">
    <div class="flex justify-between items-baseline px-1">
      <div>
        <mat-form-field>
          <mat-label>{{ 'SEARCH_ITEMS' | translate }}</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input
            type="text"
            [formControl]="textSearch"
            [placeholder]="'SEARCH_ITEMS' | translate"
            matInput
          />
        </mat-form-field>
      </div>
      <button skButton color="green" (click)="newSubject()">
        {{ 'NEW' | translate }}
      </button>
    </div>
    <table
      mat-table
      [dataSource]="store.subjects()"
      matSort
      (matSortChange)="changeSort($event)"
    >
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="short_name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'SHORT_NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.short_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="code">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'CODE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.code }}
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
        <th mat-header-cell *matHeaderCellDef>
          {{ 'ACTIONS.TITLE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button (click)="editSubject(item)">
            <mat-icon class="text-emerald-600">edit_square</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteSubject(item)">
            <mat-icon class="text-red-600">delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedCols"></tr>
    </table>

    <sk-paginator [count]="store.count()" (paginate)="getCurrentPage($event)" />
  </div>`,
})
export class SchoolSubjectsComponent implements OnInit {
  public store = inject(SchoolSubjectsStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroy = inject(DestroyRef);
  public displayedCols = [
    'name',
    'short_name',
    'code',
    'created_at',
    'actions',
  ];

  public textSearch = new FormControl('', { nonNullable: true });

  public ngOnInit(): void {
    this.textSearch.valueChanges
      .pipe(debounceTime(800), takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (queryText) => patchState(this.store, { queryText }),
      });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortDirection: sort.direction,
      sortColumn: sort.active,
    });
  }

  public getCurrentPage(pagination: {
    currentPage: number;
    start: number;
    pageSize: number;
  }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public newSubject(): void {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveSubject(request);
      },
    });
  }

  public editSubject(subject: Subject): void {
    const dialogRef = this.dialog.open<Partial<Subject>>(
      SubjectsFormComponent,
      {
        minWidth: '36rem',
        disableClose: true,
        data: subject,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveSubject({ ...request, id: subject.id });
      },
    });
  }

  public deleteSubject(subject: Subject): void {
    const { id } = subject;
    if (!id) return;
    this.confirmation
      .openDialog({
        title: 'CONFIRMATION.DELETE.TITLE',
        description: 'CONFIRMATION.DELETE.TEXT',
        icon: 'heroTrash',
        color: 'red',
        confirmButtonText: 'CONFIRMATION.DELETE.CONFIRM',
        cancelButtonText: 'CONFIRMATION.DELETE.CANCEL',
        showCancelButton: true,
      })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (res) => {
          !!res && this.store.deleteSubject(id);
        },
      });
  }
}
