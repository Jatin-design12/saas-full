//===============================================================================
// © 2021 .Kritin Digital solutions  All rights reserved.
// Original Author: Aman Mishra
// Original Date: 7 June 2021
// @desc : spinner operator
//==============================================================================
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  loading: any;
  private visible$ = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;
  private creatingLoader: Promise<void> | null = null;
  private readonly loaderId = 'global-app-spinner';

  constructor(
    public loadingController: LoadingController,
  ) { }

  async presentLoading() {
    this.activeRequests++;

    if (this.loading) {
      return;
    }

    if (this.creatingLoader) {
      await this.creatingLoader;
      return;
    }

    this.creatingLoader = (async () => {
      this.loading = await this.loadingController.create({
        id: this.loaderId,
        message: 'Please wait...',
        spinner: 'crescent',
        cssClass: 'loader-css-class',
      });
      await this.loading.present();
    })();

    try {
      await this.creatingLoader;
    } finally {
      this.creatingLoader = null;
    }
  }

  async dismissLoading() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }

    if (this.activeRequests > 0) {
      return;
    }

    try {
      if (this.creatingLoader) {
        await this.creatingLoader;
      }

      if (this.loading) {
        await this.loading.dismiss();
      } else {
        await this.loadingController.dismiss(undefined, undefined, this.loaderId);
      }
    } catch (error) {
      // ignore: loader may already be dismissed
    } finally {
      this.loading = null;
      this.activeRequests = 0;
    }
  }

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }

  isVisible(): Observable<boolean> {
    return this.visible$.asObservable().pipe(share());
  }
}