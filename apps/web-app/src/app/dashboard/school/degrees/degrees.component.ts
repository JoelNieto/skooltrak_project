import { Dialog } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { Degree } from '@skooltrak/models';
import { ConfirmationService } from '@skooltrak/ui';

import { DegreesFormComponent } from './degrees-form.component';
import { SchoolDegreesStore } from './degrees.store';

@Component({
  selector: 'sk-school-degrees',
  standalone: true,
  imports: [
    TranslateModule,
    DatePipe,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatTableModule,
    MatSortModule,
  ],
  providers: [SchoolDegreesStore, ConfirmationService],
  template: `<div class="relative ">
    <div class="flex justify-between items-baseline px-1">
      <mat-form-field class="w-96">
        <mat-label for="table-search">Search</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          id="table-search"
          placeholder="Search for items"
          matInput
        />
      </mat-form-field>

      <button mat-flat-button (click)="newDegree()">
        <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
      </button>
    </div>
    <table
      mat-table
      [dataSource]="store.degrees()"
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
      <ng-container matColumnDef="level(name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'LEVEL' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.level.name }}
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
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="editDegree(item)">
              <mat-icon>edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
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
export class SchoolDegreesComponent {
  public store = inject(SchoolDegreesStore);
  private dialog = inject(Dialog);
  private confirmation = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);
  public displayedCols = ['name', 'level(name)', 'created_at', 'actions'];

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

  public newDegree(): void {
    const dialogRef = this.dialog.open<Partial<Degree>>(DegreesFormComponent, {
      minWidth: '36rem',
      disableClose: true,
    });

    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (request) => {
        !!request && this.store.saveDegree(request);
      },
    });
  }

  public editDegree(degree: Degree): void {
    const dialogRef = this.dialog.open<Partial<Degree>>(DegreesFormComponent, {
      minWidth: '36rem',
      disableClose: true,
      data: degree,
    });
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (request) => {
        !!request && this.store.saveDegree({ ...request, id: degree.id });
      },
    });
  }

  public deleteDegree(degree: Degree): void {
    const { id } = degree;
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => !!id && !!res && this.store.deleteDegree(id),
      });
  }
}
