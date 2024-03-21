import { Dialog } from '@angular/cdk/dialog';
import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { patchState } from '@ngrx/signals';
import { TranslateModule } from '@ngx-translate/core';
import { webStore } from '@skooltrak/store';
import { CardComponent, PaginatorComponent } from '@skooltrak/ui';

import { AssignationFormComponent } from '../assignation-form/assignation-form.component';
import { QuizzesStore } from '../quizzes.store';

@Component({
  selector: 'sk-quizzes-list',
  standalone: true,
  imports: [
    CardComponent,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    RouterLink,
    TranslateModule,
    MatIcon,
    MatPrefix,
    MatTableModule,
    DatePipe,
    MatMenuModule,
    MatIconButton,
    RouterLink,
    PaginatorComponent,
    MatSortModule,
    NgClass,
  ],
  template: `<sk-card>
    <div header class="pb-2">
      <h2
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'QUIZZES.TITLE' | translate }}
      </h2>
    </div>
    <div class="flex justify-between items-baseline">
      <mat-form-field class="w-96" appearance="outline">
        <mat-label>{{ 'SEARCH.TITLE' | translate }}</mat-label>
        <input
          type="text"
          [placeholder]="'SEARCH.PLACEHOLDER' | translate"
          matInput
        />
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>
      <div class="flex gap-3">
        <button mat-flat-button color="primary" routerLink="../assignations">
          <mat-icon>event_available</mat-icon>
          {{ 'QUIZZES.ASSIGNATIONS' | translate }}
        </button>
        <button mat-flat-button color="accent" routerLink="../new">
          <mat-icon>add</mat-icon>
          {{ 'NEW' | translate }}
        </button>
      </div>
    </div>
    <table
      mat-table
      [dataSource]="store.quizzes()"
      matSort
      (matSortChange)="changeSort($event)"
    >
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">{{ item.title }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'QUIZZES.DESCRIPTION' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">{{ item.description }}</td>
      </ng-container>
      <ng-container matColumnDef="user(first_name)">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'USER' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          <div class="flex">
            <div
              class="px-3 py-1.5 rounded-full  text-xs"
              [ngClass]="{
                'bg-emerald-100 text-emerald-600 border border-emerald-500':
                  item.user_id === auth.userId()
              }"
            >
              {{ item.user.first_name }} {{ item.user.father_name }}
            </div>
          </div>
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
      <ng-container matColumnDef="updated_at">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>
          {{ 'UPDATED_AT' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.updated_at | date: 'medium' }}
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
            <button mat-menu-item (click)="assignQuiz(item.id)">
              <mat-icon color="primary">event_available</mat-icon>
              <span>{{ 'QUIZZES.ASSIGN' | translate }}</span>
            </button>
            <button
              mat-menu-item
              routerLink="../preview"
              [queryParams]="{ quizId: item.id }"
            >
              <mat-icon color="accent">preview</mat-icon>
              <span>{{ 'ACTIONS.PREVIEW' | translate }}</span>
            </button>
            @if (item.user_id === auth.userId()) {
              <a
                mat-menu-item
                routerLink="../edit"
                [queryParams]="{ quizId: item.id }"
              >
                <mat-icon color="accent">edit_square</mat-icon>
                <span>{{ 'ACTIONS.EDIT' | translate }}</span>
              </a>
              <button mat-menu-item>
                <mat-icon color="warn">delete</mat-icon>
                <span>{{ 'ACTIONS.DELETE' | translate }}</span>
              </button>
            }
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
    <sk-paginator [count]="store.count()" (paginate)="getCurrentPage($event)" />
  </sk-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizzesListComponent {
  public displayedColumns = [
    'title',
    'description',
    'user(first_name)',
    'created_at',
    'updated_at',
    'actions',
  ];
  public store = inject(QuizzesStore);
  private dialog = inject(Dialog);
  public auth = inject(webStore.AuthStore);

  public getCurrentPage(pagination: { pageSize: number; start: number }): void {
    const { start, pageSize } = pagination;
    patchState(this.store, { start, pageSize });
  }

  public changeSort(sort: Sort): void {
    patchState(this.store, {
      sortColumn: sort.active,
      sortDirection: sort.direction,
    });
  }

  public assignQuiz(quizId?: string): void {
    this.dialog.open(AssignationFormComponent, {
      data: { quizId },
      width: '48rem',
      maxWidth: '90%',
    });
  }
}
