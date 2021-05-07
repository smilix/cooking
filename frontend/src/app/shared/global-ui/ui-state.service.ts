import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({providedIn: 'root'})
export class UiStateService {

  constructor(
    @Inject(DOCUMENT) private document: Document) {
  }

  disableBodyScroll(isEnabled: boolean): void {

    if (isEnabled) {
      this.document.body.classList.add('disable-scroll');
    } else {
      this.document.body.classList.remove('disable-scroll');
    }
  }


}
