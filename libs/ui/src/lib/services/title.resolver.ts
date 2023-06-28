import { Injectable, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private translate: TranslateService;
  constructor(private readonly title: Title, private injector: Injector) {
    super();
    this.translate = this.injector.get(TranslateService);
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    !!title &&
      this.title.setTitle(
        `${this.translate.instant('App title')} | ${this.translate.instant(
          title
        )}`
      );
    !title && this.title.setTitle(this.translate.instant('App title'));
  }
}
