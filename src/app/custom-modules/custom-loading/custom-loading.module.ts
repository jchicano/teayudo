import { CustomToastModule } from './../custom-toast/custom-toast.module';
import { environment } from './../../../environments/environment.prod';
import { LoadingController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomLoadingModule {
  myloading: any;
  timeout;

  constructor(
    private loadingController: LoadingController,
    private toastC: CustomToastModule) {
  }
  async show(msg) {
    this.myloading = await this.loadingController.create({
      message: msg,
      spinner: null,
      leaveAnimation: null,
      cssClass: 'loading-custom'
    });
    this.timeout = setTimeout(() => {
      this.myloading.dismiss();
      this.toastC.show("Error al cargar datos");
    }, environment.timemaxloading);
    await this.myloading.present();
  }
  hide() {
    if (this.myloading) {
      clearTimeout(this.timeout);
      this.myloading.dismiss();
    }
  }
}
