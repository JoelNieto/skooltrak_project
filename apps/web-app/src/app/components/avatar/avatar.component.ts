import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  public avatarUrl = signal<SafeResourceUrl | undefined>(undefined);
  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);

  constructor() {
    effect(() => this.downloadImage(this.fileName()));
  }

  private async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downloadFile(path, this.bucket());

      if (data instanceof Blob) {
        this.avatarUrl.set(
          this.dom.bypassSecurityTrustUrl(URL.createObjectURL(data)),
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message);
      }
    }
  }
}
