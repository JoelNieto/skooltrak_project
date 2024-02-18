import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

import { QuizzesStore } from '../quizzes.store';

@Component({
  selector: 'sk-quizzes-list',
  standalone: true,
  imports: [
    CardComponent,
    ButtonDirective,
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
  ],
  template: `<sk-card>
    <div header>
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
      <a skButton color="green" routerLink="../new">
        {{ 'NEW' | translate }}
      </a>
    </div>
    <table mat-table [dataSource]="store.quizzes()">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>
          {{ 'QUIZZES.NAME' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">{{ item.title }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>
          {{ 'QUIZZES.DESCRIPTION' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">{{ item.description }}</td>
      </ng-container>
      <ng-container matColumnDef="user">
        <th mat-header-cell *matHeaderCellDef>
          {{ 'USER' | translate }}
        </th>
        <td mat-cell *matCellDef="let item">
          {{ item.user.first_name }} {{ item.user.father_name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="created_at">
        <th mat-header-cell *matHeaderCellDef>
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
            <a
              mat-menu-item
              routerLink="../edit"
              [queryParams]="{ quizId: item.id }"
            >
              <mat-icon class="text-emerald-600">edit_square</mat-icon>
              <span>{{ 'ACTIONS.EDIT' | translate }}</span>
            </a>
          </mat-menu>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </sk-card>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizzesListComponent {
  public displayedColumns = [
    'title',
    'description',
    'user',
    'created_at',
    'actions',
  ];
  public store = inject(QuizzesStore);
}
