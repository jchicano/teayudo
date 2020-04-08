import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DefaultAlertModule {

  constructor(
    private alertController: AlertController,
    private router: Router
  ) { }

  async show(title: string, subtitle: string, msg: string, buttons: string[] = ['OK']) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: msg,
      backdropDismiss: false,
      buttons: buttons,
    });

    await alert.present();
  }

}
