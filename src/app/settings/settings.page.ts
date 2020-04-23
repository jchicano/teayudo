import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  // NOTE no usado en ionic 5 https://commentedcoding.com/how-to-create-a-settings-page-with-customizable-font-family-in-ionic-5-steps/

  private subscription: Subscription;

  constructor(
    private platform: Platform,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  // NOTE https://stackoverflow.com/a/58736680
  // Para que funcione el boton atras al salir de la app
  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      this.navCtrl.navigateBack('/home');
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

}
