import { Component, inject, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/auth';

@Component({
  selector: 'skooltrak-avatar',
  standalone: true,
  imports: [],
  template: `<img [src]="_avatarUrl" class="h-full" />`,
  styles: [],
})
export class AvatarComponent {
  @Input() bucket: 'avatars' | 'crests' = 'avatars';
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
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(
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
