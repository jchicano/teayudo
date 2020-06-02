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

  private toastInstace: any;

  constructor(private toastCtrl: ToastController) { }

  // NOTE // https://stackoverflow.com/a/55125430/10387022
  show(msg: string): void {
    this.toastCtrl.dismiss()
      .then((obj) => { })
      .catch(() => { })
      .finally(() => {
        this.manageToast(msg);
      });
  }

  private manageToast(msg: string): void {
    this.toastInstace = this.toastCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Toast dismissed');
          }
        }
      ],
      animated: true,
      position: 'bottom',
      duration: 3000
    }).then((obj) => {
      obj.present();
    });
  }

  async showTop(msg, time?) {
    if (this.toastInstace)
      this.toastInstace.dismiss();
    if (!time) {
      this.toastInstace = await this.toastCtrl.create({
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
      this.toastInstace.present();
    } else {
      this.toastInstace = await this.toastCtrl.create({
        message: msg,
        animated: true,
        position: 'top',
        duration: time
      });
      this.toastInstace.present();
    }
  }
}
