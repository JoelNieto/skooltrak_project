import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { UsersSearchStore } from './users-search.store';
import { MatListModule } from '@angular/material/list';
import { FileUrlPipe } from '../../auth/pipes/file-url.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { UserProfile } from '@skooltrak/models';

@Component({
  selector: 'sk-users-search',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    FileUrlPipe,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [UsersSearchStore],
  template: `
    <h2 mat-dialog-title>{{ 'USERS_SEARCH.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ 'SEARCH_ITEMS' | translate }}</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          type="text"
          [placeholder]="'SEARCH_ITEMS' | translate"
          [formControl]="searchControl"
          matInput
        />
      </mat-form-field>
      <mat-chip-set>
        @for (
          selected of selectedControl.getRawValue();
          track selected.user_id
        ) {
          <mat-chip
            >{{ selected.user.first_name }}
            {{ selected.user.father_name }}
          </mat-chip>
        }
      </mat-chip-set>
      <mat-selection-list [formControl]="selectedControl">
        @for (user of store.filteredPeople(); track user.user_id) {
          <mat-list-option [value]="user">
            <img
              matListItemAvatar
              [alt]="user.user.first_name"
              [src]="user.user.avatar_url! | fileUrl: 'avatars'"
            />
            <div matListItemTitle>
              {{ user.user.first_name }}
              {{ user.user.father_name }}
            </div>
            <div matListItemLine>
              {{ user.role! | translate }}
              {{ user.group?.name }}
            </div>
          </mat-list-option>
        }
      </mat-selection-list>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button
        mat-flat-button
        [disabled]="selectedControl.invalid"
        (click)="saveChanges()"
      >
        {{ 'SAVE_CHANGES' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class UsersSearchComponent implements OnInit {
  public store = inject(UsersSearchStore);
  public searchControl = new FormControl('', { nonNullable: true });
  public selectedControl = new FormControl<UserProfile[]>([], {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });

  public ngOnInit(): void {
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (searchText) => patchState(this.store, { searchText }),
    });
  }

  public saveChanges(): void {
    console.info(this.selectedControl.getRawValue());
  }
}
