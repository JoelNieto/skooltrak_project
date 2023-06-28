import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/auth';

@Component({
  selector: 'sk-avatar',
  standalone: true,
  imports: [NgClass],
  template: `<img
    [attr.src]="_avatarUrl"
    class="h-full"
    [class.rounded-full]="rounded"
  />`,
  styles: [],
})
export class AvatarComponent {
  @Input() bucket: 'avatars' | 'crests' = 'avatars';
  @Input() rounded!: boolean;
  @Input()
  set avatarUrl(url: string | null) {
    if (url) {
      this.downloadImage(url);
    }
  }
  _avatarUrl: SafeResourceUrl | undefined;
  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path, this.bucket);

      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustUrl(
          URL.createObjectURL(data)
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message);
      }
    }
  }
}
