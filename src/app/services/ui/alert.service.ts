import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController
  ) { }

  async presentAlert(title: string, subtitle: string, msg: string, buttons: string[] = ['OK']) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: msg,
      buttons: buttons
    });

    await alert.present();
  }
}