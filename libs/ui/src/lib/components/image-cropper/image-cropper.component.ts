import { DIALOG_DATA } from '@angular/cdk/dialog';
import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperOptions } from '@skooltrak/models';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'sk-image-cropper',
  standalone: true,
  imports: [
    ImageCropperModule,
    MatButtonModule,
    MatDialogModule,
    NgStyle,
    TranslateModule,
    MatIcon,
  ],
  providers: [provideIcons({ heroXMark })],
  template: ` <h2 mat-dialog-title>
      {{ 'IMAGE_CROPPER.TITLE' | translate }}
    </h2>
    <mat-dialog-content>
      <button mat-flat-button class="tertiary" (click)="fileInput.click()">
        {{ 'IMAGE_CROPPER.CHOOSE_PICTURE' | translate }}
      </button>
      <div class="space-4 mt-2 flex flex-col">
        <image-cropper
          [imageChangedEvent]="imgChangeEvt"
          [maintainAspectRatio]="options.fixedRatio"
          [containWithinAspectRatio]="true"
          [imageQuality]="100"
          [aspectRatio]="options.ratio"
          [resizeToHeight]="256"
          [format]="options.format"
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
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon>
        {{ 'CONFIRMATION.CANCEL' | translate }}
      </button>
      <button
        mat-flat-button
        [disabled]="!imageFile"
        (click)="dialogRef.close({ imageFile, cropImgPreview })"
      >
        {{ 'IMAGE_CROPPER.CONFIRM' | translate }}
      </button>
    </mat-dialog-actions>
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
    format: 'jpeg',
  };

  public dialogRef = inject(
    MatDialogRef<{
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
    !!this.data && (this.options = { ...this.options, ...this.data });
  }

  onFileChange(event: unknown) {
    this.imgChangeEvt = event;
  }

  cropImg(e: ImageCroppedEvent) {
    const { objectUrl, blob } = e;
    !!objectUrl &&
      (this.cropImgPreview = this.sanitizer.bypassSecurityTrustUrl(objectUrl));
    !!blob &&
      (this.imageFile = new File([blob], `avatar.${this.options.format}`, {
        type: `image/${this.options.format}`,
      }));
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
