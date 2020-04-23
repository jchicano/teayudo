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
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('Toast dismissed');
          }
        }
      ],
      animated: true,
      position: 'bottom',
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
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              console.log('Toast dismissed');
            }
          }
        ],
        animated: true,
        position: 'top'
      });
      this.toast.present();
    } else {
      this.toast = await this.toastCtrl.create({
        message: msg,
        animated: true,
        position: 'top',
        duration: time
      });
      this.toast.present();
    }
  }
}
