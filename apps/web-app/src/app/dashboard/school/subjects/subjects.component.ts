import { DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormField,
  MatLabel,
  MatPrefix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';
import { debounceTime } from 'rxjs';

import { SubjectsFormComponent } from './subjects-form.component';
import { SchoolSubjectsStore } from './subjects.store';

@Component({
  selector: 'sk-school-subjects',
  imports: [
    MatButton,
    MatPaginatorModule,
    DialogModule,
    DatePipe,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatPrefix,
    MatIcon,
    MatTableModule,
    MatSortModule,
    MatIconButton,
    MatMenuModule,
  ],
  providers: [SchoolSubjectsStore, ConfirmationService],
  template: `<div class="relative ">
    <div class="flex justify-between items-baseline px-1">
      <mat-form-field class="w-96">
        <mat-label>{{ 'SEARCH_ITEMS' | translate }}</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          [formControl]="textSearch"
          [placeholder]="'SEARCH_ITEMS' | translate"
          matInput
        />
      </mat-form-field>

      <button mat-flat-button color="primary" (click)="editSubject()">
        <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
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
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let item">
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editSubject(item)">
              <mat-icon>edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button mat-menu-item (click)="deleteSubject(item.id)">
              <mat-icon>delete</mat-icon>
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
export class SchoolSubjectsComponent implements OnInit {
  public store = inject(SchoolSubjectsStore);
  private dialog = inject(MatDialog);
  private containerRef = inject(ViewContainerRef);
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
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (queryText) => patchState(this.store, { queryText, start: 0 }),
      });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortDirection: sort.direction,
      sortColumn: sort.active,
    });
  }

  public pageEvent(e: PageEvent): void {
    const { pageIndex, pageSize } = e;
    patchState(this.store, { start: pageIndex, pageSize });
  }

  public editSubject(item?: Subject): void {
    this.dialog.open(SubjectsFormComponent, {
      minWidth: '36rem',
      disableClose: true,
      viewContainerRef: this.containerRef,
      data: item,
    });
  }

  public deleteSubject(id: string): void {
    this.store.deleteSubject(id);
  }
}
