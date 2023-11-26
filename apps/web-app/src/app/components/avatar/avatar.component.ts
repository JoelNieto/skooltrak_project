import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/auth';

@Component({
  selector: 'sk-avatar',
  standalone: true,
  imports: [],
  template: `<img
    [attr.src]="_avatarUrl"
    class="h-full"
    [class.rounded-full]="rounded"
  />`,
  styles: `
      :host {
        display: block;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() public bucket: 'avatars' | 'crests' = 'avatars';
  @Input({ transform: booleanAttribute }) public rounded: boolean = false;
  @Input({ required: true })
  public set avatarUrl(url: string) {
    if (url) {
      this.downloadImage(url);
    }
  }
  public _avatarUrl: SafeResourceUrl | undefined;
  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);

  private async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downLoadImage(path, this.bucket);

      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustUrl(
          URL.createObjectURL(data),
        );
        this.cd.detectChanges();
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message);
      }
    }
  }
}
