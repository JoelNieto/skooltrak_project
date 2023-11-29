import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/store';

@Component({
  selector: 'sk-picture',
  standalone: true,
  imports: [],
  template: `<img [attr.src]="src()" class="rounded shadow" />`,
  styles: `
      :host {
        display: block;
      }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ required: false, alias: 'bucket' }) set _bucket(
    bucket: string | undefined,
  ) {
    this.bucket.set(bucket);
  }
  @Input({ required: true }) set pictureURL(src: string) {
    this.path.set(src);
  }

  private path = signal('');

  public src = signal<SafeResourceUrl | undefined>('');
  public bucket = signal<string | undefined>(undefined);

  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);

  constructor() {
    effect(
      () => {
        if (!this.bucket()) {
          this.src.set(this.path());
        } else {
          this.downloadImage(this.path());
        }
      },
      { allowSignalWrites: true },
    );
  }

  private async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downLoadImage(path, this.bucket()!);

      if (data instanceof Blob) {
        this.src.set(
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
