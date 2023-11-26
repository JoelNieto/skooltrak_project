import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperOptions } from '@skooltrak/models';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

import { ButtonDirective } from '../../directives/button/button.directive';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'sk-image-cropper',
  standalone: true,
  imports: [
    ImageCropperModule,
    ButtonDirective,
    NgIconComponent,
    CardComponent,
    NgStyle,
    TranslateModule,
  ],
  providers: [provideIcons({ heroXMark })],
  template: `<sk-card>
      <div class="flex items-start justify-between" header>
        <h3
          class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
        >
          {{ 'IMAGE_CROPPER.TITLE' | translate }}
        </h3>
        <button (click)="dialogRef.close()">
          <ng-icon
            name="heroXMark"
            size="24"
            class="text-gray-700 dark:text-gray-100"
          />
        </button>
      </div>
      <button skButton color="green" (click)="fileInput.click()">
        {{ 'IMAGE_CROPPER.CHOOSE_PICTURE' | translate }}
      </button>
      <div class="space-4 mt-2 flex flex-col">
        <image-cropper
          [imageChangedEvent]="imgChangeEvt"
          [maintainAspectRatio]="options.fixedRatio"
          [containWithinAspectRatio]="true"
          [aspectRatio]="options.ratio"
          [resizeToHeight]="256"
          format="png"
          (imageCropped)="cropImg($event)"
          (imageLoaded)="imgLoad()"
          (cropperReady)="initCropper()"
          (loadImageFailed)="imgFailed()"
        />
        @if (cropImgPreview) {
          <div class="my-4 flex ">
            <div>
              <span class="font-sans font-semibold text-gray-600">{{
                'IMAGE_CROPPER.PREVIEW' | translate
              }}</span>
              <br />
              <img
                [src]="cropImgPreview"
                class="border border-gray-400"
                [style.max-height]="'6rem'"
              />
            </div>
          </div>
        }
      </div>
      <div class="flex justify-end" footer>
        <button
          skButton
          color="blue"
          class="w-full"
          [disabled]="!imageFile"
          (click)="dialogRef.close({ imageFile, cropImgPreview })"
        >
          {{ 'IMAGE_CROPPER.CONFIRM' | translate }}
        </button>
      </div>
    </sk-card>
    <input
      hidden
      type="file"
      #fileInput
      accept="image/png, image/jpeg, image/webp"
      (change)="onFileChange($event)"
    />`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ImageCropperComponent implements OnInit {
  options: ImageCropperOptions = {
    fixedRatio: false,
    ratio: 4 / 4,
  };

  public dialogRef = inject(
    DialogRef<{
      imageFile: File | undefined;
      cropImgPreview: string | SafeUrl;
    }>,
  );

  private data: ImageCropperOptions | undefined = inject(DIALOG_DATA);

  private sanitizer = inject(DomSanitizer);
  imgChangeEvt: unknown = '';

  cropImgPreview: string | SafeUrl = '';

  imageFile: File | undefined;

  ngOnInit(): void {
    !!this.data && (this.options = this.data);
  }

  onFileChange(event: unknown) {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    const { objectUrl, blob } = e;
    !!objectUrl &&
      (this.cropImgPreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    !!blob &&
      (this.imageFile = new File([blob], 'avatar.png', { type: 'image/png' }));
  }

  imgLoad() {
    // display cropper tool
  }

  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }
}
