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
  selector: 'skooltrak-picture',
  standalone: true,
  template: `<img [class.rounded]="rounded()" [attr.src]="src()" />`,
  styles: `
      :host {
        display: block;
      }

      img.rounded { border-radius: 50%; }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureComponent {
  public bucket = input<string>();
  public fileName = input.required<string>();

  public rounded = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  public src = signal<SafeResourceUrl | undefined>('');

  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);

  constructor() {
    effect(
      () => {
        if (!this.bucket()) {
          this.src.set(this.fileName());
        } else {
          this.downloadImage(this.fileName());
        }
      },
      { allowSignalWrites: true },
    );
  }

  private async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downloadFile(path, this.bucket()!);

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
