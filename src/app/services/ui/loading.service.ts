import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loadingInstance: any;

  constructor(private loadingController: LoadingController) { }

  close(): Promise<boolean> {
    return this.loadingController.dismiss();
  }

  async show(msg: string): Promise<void> {
    this.loadingInstance = this.loadingController.create({
      message: msg,
    })
    .then((obj) => {
      return obj.present();
    });
  }
}
