import { Subscription } from 'rxjs';
import { LottieSplashScreen } from '@ionic-native/lottie-splash-screen/ngx';
import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Alumnos',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Configuración',
      url: '/settings',
      icon: 'settings'
    }
  ];
  public fontFamilyClass = '';
  public subscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private lottieSplashScreen: LottieSplashScreen
  ) {
    this.initializeApp();
    this.events.subscribe(
      'update:font-family',
      (className) => {
        this.fontFamilyClass = className;
      }
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // NOTE https://medium.com/@prashantg9912/how-to-add-beautiful-lottie-splashsceen-to-ionic-app-7fdbc00f6cea
      // Hide splash screen after 3 seconds
      setTimeout(() => {
        this.lottieSplashScreen.hide();
      }, 3000);
    });
  }

  // NOTE https://stackoverflow.com/a/58736680
  // Para que funcione el boton atras al salir de la app
  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
}
