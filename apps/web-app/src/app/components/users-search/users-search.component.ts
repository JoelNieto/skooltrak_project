import { DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { UserProfile } from '@skooltrak/models';

import { AvatarComponent } from '../avatar/avatar.component';
import { UsersSearchStore } from './users-search.store';

@Component({
  selector: 'sk-users-search',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatTableModule,
    MatButtonModule,
    AvatarComponent,
    DatePipe,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatPaginatorModule,
    MatChipsModule,
    NgClass,
  ],
  providers: [UsersSearchStore],
  template: `
    <h2 mat-dialog-title>{{ 'USERS_SEARCH.TITLE' | translate }}</h2>

    <mat-dialog-content>
      <mat-chip-set>
        @for (item of store.selected(); track item.user_id) {
          <mat-chip class="primary"
            >{{ item.user?.first_name }} {{ item.user?.father_name }}</mat-chip
          >
        }
      </mat-chip-set>
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
                <div class="mat-subtitle-2">
                  {{ item.user.first_name }} {{ item.user.father_name }}
                </div>
                <div class="mat-hint">
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

        <tr mat-header-row *matHeaderRowDef="displayedCols"></tr>
        <tr
          mat-row
          class="cursor-pointer"
          (click)="store.toggleSelected(row)"
          [class.selected]="isSelected(row)"
          *matRowDef="let row; columns: displayedCols"
        ></tr>
      </table>
      <mat-paginator
        [length]="store.count()"
        [pageIndex]="store.start()"
        [pageSize]="store.pageSize()"
        [pageSizeOptions]="[5, 10, 15]"
        [showFirstLastButtons]="true"
        (page)="pageEvent($event)"
      />
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button mat-flat-button>{{ 'SAVE_CHANGES' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .selected {
      font-weight: bold;
    }
  `,
})
export class UsersSearchComponent {
  public store = inject(UsersSearchStore);
  public displayedCols = [
    'user(first_name)',
    'user(document_id)',
    'role',
    'group(name)',
  ];

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

  public isSelected(item: UserProfile): boolean {
    return this.store.selected().some((x) => x.user_id === item.user_id);
  }
}
