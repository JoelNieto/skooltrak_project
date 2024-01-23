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
        const { data } = this.supabase.getFileURL(
          this.fileName(),
          this.bucket(),
        );
        if (data.publicUrl) {
          this.avatarUrl.set(data.publicUrl);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
