import { ToastController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomToastModule {
  toast;
  constructor(private toastCtrl: ToastController) { }

  async show(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      animated: true,
      position: 'bottom',
      closeButtonText: 'OK',
      duration: 3000
    });
    toast.present();
  }

  async showTop(msg, time?) {
    if (this.toast)
      this.toast.dismiss();
    if (!time) {
      this.toast = await this.toastCtrl.create({
        message: msg,
        showCloseButton: true,
        animated: true,
        position: 'top',
        closeButtonText: 'OK',
      });
      this.toast.present();
    } else {
      this.toast = await this.toastCtrl.create({
        message: msg,
        showCloseButton: false,
        animated: true,
        position: 'top',
        closeButtonText: 'OK',
        duration: time
      });
      this.toast.present();
    }
  }
}
