import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { ClassGroup } from '@skooltrak/models';
import { CardComponent } from '@skooltrak/ui';

import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolGroupsFormComponent } from './groups-form.component';
import { SchoolGroupsStore } from './groups.store';

@Component({
  selector: 'sk-admin-groups-list',
  standalone: true,
  imports: [
    TranslateModule,
    CardComponent,
    MatPaginatorModule,
    MatButton,
    DatePipe,
    UserChipComponent,
    DialogModule,
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
  providers: [SchoolGroupsStore],
  template: `
    <div class="relative ">
      <div class="flex justify-between items-baseline px-1">
        <mat-form-field class="w-full lg:w-96">
          <mat-label for="table-search">Search</mat-label>
          <mat-icon matIconPrefix>search</mat-icon>
          <input
            type="text"
            id="table-search"
            matInput
            placeholder="Search for items"
          />
        </mat-form-field>

        <button mat-flat-button color="primary" (click)="newGroup()">
          <mat-icon>add</mat-icon><span>{{ 'NEW' | translate }}</span>
        </button>
      </div>
      <table
        mat-table
        [dataSource]="store.groups()"
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
        <ng-container matColumnDef="plan(year)">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'PLAN' | translate }}
          </th>
          <td mat-cell *matCellDef="let item">
            {{ item.plan.name }}
          </td>
        </ng-container>
        <ng-container matColumnDef="teachers">
          <th mat-header-cell *matHeaderCellDef>
            {{ 'GROUPS.TEACHERS' | translate }}
          </th>
          <td mat-cell *matCellDef="let item">
            <div class="flex gap-1">
              @for (teacher of item.teachers; track teacher.id) {
                <sk-user-chip [user]="teacher" />
              }
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="degree(name)">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ 'GROUPS.DEGREE' | translate }}
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
          <th mat-header-cell *matHeaderCellDef>
            {{ 'ACTIONS.TITLE' | translate }}
          </th>
          <td mat-cell *matCellDef="let item">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button type="button" mat-menu-item (click)="editGroup(item)">
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
      <mat-paginator
        [length]="store.count()"
        [pageIndex]="store.start()"
        [pageSize]="store.pageSize()"
        [pageSizeOptions]="[5, 10, 15]"
        [showFirstLastButtons]="true"
        (page)="pageEvent($event)"
      />
    </div>
  `,
})
export class SchoolGroupsComponent {
  public store = inject(SchoolGroupsStore);
  private dialog = inject(Dialog);
  private destroy = inject(DestroyRef);
  public displayedColumns = [
    'plan(year)',
    'name',
    'degree(name)',
    'teachers',
    'created_at',
    'actions',
  ];

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

  public newGroup(): void {
    const dialogRef = this.dialog.open<Partial<ClassGroup>>(
      SchoolGroupsFormComponent,
      {
        minWidth: '36rem',
        maxWidth: '55%',
        disableClose: true,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveGroup(request);
      },
    });
  }

  public editGroup(group: ClassGroup): void {
    const dialogRef = this.dialog.open<Partial<ClassGroup>>(
      SchoolGroupsFormComponent,
      {
        minWidth: '36rem',
        maxWidth: '55%',
        disableClose: true,
        data: group,
      },
    );
    dialogRef.closed.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (request) => {
        !!request && this.store.saveGroup({ ...request, id: group.id });
      },
    });
  }
}
