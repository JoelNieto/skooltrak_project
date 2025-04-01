import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Publication, Table } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';

import { UserChipComponent } from '../user-chip/user-chip.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'sk-publication-item',
    imports: [
        MatCardModule,
        UserChipComponent,
        MatIconModule,
        MatMenuModule,
        MatChipsModule,
        RouterLink,
        TranslateModule,
        DatePipe,
    ],
    template: ` <mat-card>
    <mat-card-header>
      <div class="flex justify-between w-full">
        <div class="flex items-center gap-2">
          <sk-user-chip [user]="post().user" />
          <span class="text-sm font-mono text-slate-400">
            {{ post().created_at | date: 'medium' }}</span
          >
        </div>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_horiz</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="deletePost()">
            <mat-icon>delete </mat-icon>
            <span>{{ 'ACTIONS.DELETE' | translate }}</span>
          </button>
        </mat-menu>
      </div>
    </mat-card-header>
    <mat-card-content>
      @if (post().course; as course) {
        <mat-chip-set>
          <a [routerLink]="['/app/courses', course.id]">
            <mat-chip class="primary" highlighted color="primary"
              >{{ course.plan?.name }} - {{ course.subject?.name }}
            </mat-chip>
          </a>
        </mat-chip-set>
      }
      <p class="mat-body py-4" [innerText]="post().body"></p>
    </mat-card-content>
  </mat-card>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicationItemComponent {
  public post = input.required<Publication>();
  public deleted = output<string>();
  private readonly supabase = inject(SupabaseService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly toast = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  private readonly destroy = inject(DestroyRef);

  public deletePost(): void {
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
        next: async (res) => {
          if (!res) return;
          const { error } = await this.supabase.client
            .from(Table.Publications)
            .delete()
            .eq('id', this.post().id);

          if (error) {
            console.error(error);

            return;
          }
          this.toast.open(this.translate.instant('ALERT.DELETED'));
          this.deleted.emit(this.post().id);
        },
      });
  }
}
