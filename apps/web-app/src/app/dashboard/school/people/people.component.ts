import { Dialog } from '@angular/cdk/dialog';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { RoleEnum, SchoolProfile, StatusEnum } from '@skooltrak/models';
import { EmptyTableComponent, LoadingComponent } from '@skooltrak/ui';

import { AvatarComponent } from '../../../components/avatar/avatar.component';
import { UserChipComponent } from '../../../components/user-chip/user-chip.component';
import { SchoolPeopleFormComponent } from './people-form.component';
import { SchoolPeopleStore } from './people.store';

@Component({
  standalone: true,
  selector: 'sk-school-people',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    UserChipComponent,
    RouterLink,
    DatePipe,
    JsonPipe,
    AvatarComponent,
    LoadingComponent,
    EmptyTableComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatInputModule,
    MatIcon,
    MatOption,
    MatTableModule,
    MatSortModule,
    MatIconButton,
    MatMenuModule,
  ],
  providers: [SchoolPeopleStore],
  styles: `

    `,
  template: `<div class="relative ">
    <div class="flex justify-between gap-4 px-1">
      <mat-form-field class="flex-1">
        <mat-label>{{ 'ROLE' | translate }}</mat-label>
        <mat-select [formControl]="roleControl">
          <mat-option value="all">{{
            'PEOPLE.ALL_ROLES' | translate
          }}</mat-option>
          @for (role of roles; track role) {
            <mat-option [value]="role">
              {{ 'PEOPLE.' + role | translate }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="flex-1">
        <mat-label>{{ 'PEOPLE.STATUS' | translate }}</mat-label>
        <mat-select [formControl]="statusControl">
          <mat-option value="all">{{
            'PEOPLE.ALL_STATUS' | translate
          }}</mat-option>
          @for (status of statuses; track status) {
            <mat-option [value]="status">
              {{ 'PEOPLE.' + status | translate }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="flex-1">
        <mat-label>{{ 'SEARCH_ITEMS' | translate }}</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          [placeholder]="'SEARCH_ITEMS' | translate"
          matInput
        />
      </mat-form-field>
    </div>
    <table
      mat-table
      [dataSource]="store.people()"
      matSort
      (matSortChange)="sortChange($event)"
    >
      <ng-container matColumnDef="user(first_name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PEOPLE.PERSON' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          <div class="flex items-center gap-2">
            <sk-avatar
              [fileName]="item.user.avatar_url ?? 'default_avatar.jpg'"
              class="h-10"
              [rounded]="true"
            />
            <div class="flex flex-col">
              <div class="text-base text-gray-700 dark:text-gray-200">
                {{ item.user.first_name }} {{ item.user.father_name }}
              </div>
              <div class="font-mono text-sm text-gray-400">
                {{ item.user.email }}
              </div>
            </div>
          </div>
        </td>
      </ng-container>
      <ng-container matColumnDef="user(document_id)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PEOPLE.DOCUMENT_ID' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.user.document_id }}
        </td>
      </ng-container>
      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'PEOPLE.ROLE' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.role | translate }}
        </td>
      </ng-container>
      <ng-container matColumnDef="group(name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'GROUPS.NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.group?.name }}
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
            <button type="button" mat-menu-item (click)="editPeople(item)">
              <mat-icon>edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </button>
            <button type="button" mat-menu-item>
              <mat-icon>delete</mat-icon>
              <span>{{ 'ACTIONS.DELETE' | translate }}</span>
            </button>
            @if (item.role === 'STUDENT') {
              <a
                mat-menu-item
                routerLink="/app/student-profile"
                [queryParams]="{ studentId: item.user_id }"
              >
                <mat-icon color="primary">badge</mat-icon>
                <span>{{ 'STUDENTS.REPORT' | translate }}</span>
              </a>
            }
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
export class SchoolPeopleComponent implements OnInit {
  public roles = Object.values(RoleEnum);
  public statuses = Object.values(StatusEnum);
  private destroy = inject(DestroyRef);
  private dialog = inject(Dialog);
  public roleControl = new FormControl<'all' | RoleEnum>('all', {
    nonNullable: true,
  });
  public displayedCols = [
    'user(first_name)',
    'user(document_id)',
    'role',
    'group(name)',
    'created_at',
    'actions',
  ];

  public statusControl = new FormControl<'all' | StatusEnum>('all', {
    nonNullable: true,
  });
  public store = inject(SchoolPeopleStore);

  public ngOnInit(): void {
    this.roleControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (role) => {
          patchState(this.store, { selectedRole: role });
        },
      });

    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (status) => {
          patchState(this.store, { selectedStatus: status });
        },
      });
  }

  public sortChange(sort: Sort): void {
    patchState(this.store, {
      sortDirection: sort.direction,
      sortColumn: sort.active,
    });
  }

  public pageEvent(e: PageEvent): void {
    const { pageIndex, pageSize } = e;
    patchState(this.store, { start: pageIndex, pageSize });
  }

  public editPeople(person: SchoolProfile): void {
    const dialogRef = this.dialog.open(SchoolPeopleFormComponent, {
      width: '34rem',
      maxWidth: '90%',
      data: person,
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({ next: () => this.store.fetchPeople(this.store.fetchData) });
  }
}
