import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { User } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

@Component({
    selector: 'sk-user-chip',
    imports: [MatChipsModule, MatIcon],
    providers: [],
    template: `<mat-chip class="tertiary">
    <img [src]="avatarUrl()" matChipAvatar class="rounded-full" />

    {{ user().first_name }}
    {{ user().father_name }}
    @if (removable()) {
      <button
        matChipRemove
        [attr.aria-label]="'remove '"
        (click)="remove.emit(user())"
      >
        <mat-icon>cancel</mat-icon>
      </button>
    }
  </mat-chip>`
})
export class UserChipComponent implements OnInit {
  public user = input.required<Partial<User>>();
  public avatarUrl = signal<string | undefined>(undefined);
  public removable = input(false);
  private supabase = inject(SupabaseService);
  public remove = output<Partial<User>>();

  public ngOnInit(): void {
    this.avatarUrl.set(
      this.supabase.getFileURL(
        this.user().avatar_url ?? 'default_avatar.jpg',
        'avatars',
      ),
    );
  }
}
