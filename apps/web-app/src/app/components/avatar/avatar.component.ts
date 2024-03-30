import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { SupabaseService } from '@skooltrak/store';

@Component({
  selector: 'sk-avatar',
  standalone: true,
  imports: [],
  template: `<img
    [attr.src]="avatarUrl()"
    class="h-full"
    [class.rounded-full]="rounded()"
  />`,
  styles: `
      :host {
        display: block;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  public bucket = input('avatars');
  public rounded = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });
  public fileName = input.required<string>();
  public avatarUrl = signal<string | undefined>(undefined);
  private supabase = inject(SupabaseService);

  constructor() {
    effect(
      () => {
        const url = this.supabase.getFileURL(this.fileName(), this.bucket());

        if (url) {
          this.avatarUrl.set(url);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
