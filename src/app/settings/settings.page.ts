import { Subscription } from 'rxjs';
import { FontService } from './../services/font.service';
import { Component, OnInit } from '@angular/core';
import { Events, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  // NOTE https://commentedcoding.com/how-to-create-a-settings-page-with-customizable-font-family-in-ionic-5-steps/

  public fontFamily: string;
  public fontList: any[];

  constructor(
    private subscription: Subscription,
    private events: Events,
    private fontS: FontService,
    private platform: Platform,
    private navCtrl: NavController
  ) {
    this.fontList = fontS.getAvailableFonts();
  }

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

  ionViewWillEnter() {
    this.fontFamily = this.fontS.getCurrentFont();
  }

  onFontFamilyChange(ev: CustomEvent) {
    const val = ev.detail.value;
    this.events.publish(
      'update:font-family',
      val
    );
    this.fontS.setCurrentFont(val);
  }

}
