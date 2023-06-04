import { IconsModule } from '@amithvns/ng-heroicons';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'skooltrak-image-cropper',
  standalone: true,
  imports: [ImageCropperModule, ButtonComponent, IconsModule, CardComponent],
  template: `<skooltrak-card>
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
      <button skooltrak-button color="green" (click)="fileInput.click()">
        Choose picture
      </button>
      <div class="flex flex-col mt-2 space-4">
        <image-cropper
          [imageChangedEvent]="imgChangeEvt"
          [maintainAspectRatio]="false"
          [aspectRatio]="4 / 3"
          [resizeToHeight]="512"
          format="png"
          (imageCropped)="cropImg($event)"
          (imageLoaded)="imgLoad()"
          (cropperReady)="initCropper()"
          (loadImageFailed)="imgFailed()"
        />
        <div class="flex my-4">
          <div>
            <span class="font-mono text-gray-600 font-semibold"
              >Image preview</span
            >
            <br />
            <img [src]="cropImgPreview" [style.max-height]="'75px'" />
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <button
            skooltrak-button
            color="blue"
            class="w-full"
            [disabled]="!imageFile"
            (click)="dialogRef.close({ imageFile, cropImgPreview })"
          >
            Save
          </button>
        </div>
      </div>
    </skooltrak-card>
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
export class ImageCropperComponent {
  public dialogRef = inject(
    DialogRef<{ imageFile: File | undefined; cropImgPreview: string }>
  );
  imgChangeEvt: any = '';

  cropImgPreview: string = '';

  imageFile: File | undefined;

  onFileChange(event: any) {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    this.cropImgPreview = e.base64!;
    if (e.base64) {
      const blob = this.dataURIToBlob(e.base64);
      this.imageFile = new File([blob], 'avatar.png', { type: 'image/png' });
    }
  }

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
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
