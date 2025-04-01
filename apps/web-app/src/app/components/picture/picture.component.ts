import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/store';

@Component({
    selector: 'sk-picture',
    imports: [],
    template: `<img [attr.src]="src()" class="rounded shadow h-full" />`,
    styles: `
      :host {
        display: block;
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictureComponent {
  public bucket = input.required<string>();

  public pictureURL = input.required<string>();

  public src = signal<SafeResourceUrl | undefined>('');

  private supabase = inject(SupabaseService);
  private dom = inject(DomSanitizer);

  constructor() {
    effect(
      () => {
        if (!this.bucket()) {
          this.src.set(this.pictureURL());
        } else {
          this.downloadImage(this.pictureURL());
        }
      },
      { allowSignalWrites: true },
    );
  }

  private async downloadImage(path: string): Promise<void> {
    try {
      const { data } = await this.supabase.downloadFile(path, this.bucket());

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
