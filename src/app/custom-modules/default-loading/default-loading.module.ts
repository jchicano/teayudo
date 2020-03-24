import { LoadingController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DefaultLoadingModule {

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
