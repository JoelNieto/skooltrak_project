import { IconsModule } from '@amithvns/ng-heroicons';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCropperOptions } from '@skooltrak/models';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

import { ButtonDirective } from '../button/button.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'sk-image-cropper',
  standalone: true,
  imports: [
    ImageCropperModule,
    ButtonDirective,
    IconsModule,
    CardComponent,
    NgStyle,
  ],
  template: `<sk-card>
      <div class="flex items-start justify-between">
        <h3
          class="font-mono text-xl text-gray-700 dark:text-gray-100 font-semibold mb-4"
        >
          Image cropper
        </h3>
        <button (click)="dialogRef.close()">
          <icon name="x-mark" class="text-gray-700 dark:text-gray-100" />
        </button>
      </div>
      <button skButton color="green" (click)="fileInput.click()">
        Choose picture
      </button>
      <div class="flex flex-col mt-2 space-4">
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
        <div class="flex my-4 ">
          <div>
            <span class="font-mono text-gray-600 font-semibold"
              >Image preview</span
            >
            <br />
            <img
              [src]="cropImgPreview"
              class="border border-gray-400"
              [style.max-height]="'75px'"
            />
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <button
            skButton
            color="blue"
            class="w-full"
            [disabled]="!imageFile"
            (click)="dialogRef.close({ imageFile, cropImgPreview })"
          >
            Save
          </button>
        </div>
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
        @apply sm:max-w-lg;
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
    DialogRef<{ imageFile: File | undefined; cropImgPreview: string | SafeUrl }>
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
