import { AppVersion } from '@ionic-native/app-version/ngx';
import { NetworkService } from './services/network.service';
import { Plugins } from '@capacitor/core';
import { Component } from '@angular/core';
import { Platform, Events } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

const { SplashScreen } = Plugins;

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
  protected showVersion: string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private events: Events,
    public network: NetworkService,
    private appVersion: AppVersion
  ) {
    SplashScreen.show({
      showDuration: 5000,
      autoHide: true
    });
    this.initializeApp();
    this.events.subscribe(
      'update:font-family',
      (className) => {
        this.fontFamilyClass = className;
      }
    );
    this.appVersion.getVersionNumber().then(v => this.showVersion = v);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // NOTE contenido eliminado https://medium.com/@prashantg9912/how-to-add-beautiful-lottie-splashsceen-to-ionic-app-7fdbc00f6cea
      // NOTE icon & splash android: https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/ && https://apetools.webprofusion.com/#/tools/imagegorilla
      console.log(
        "%cTEAyudo",
        "color:#56a3a6;font-family:Roboto;font-size:4rem;font-weight:bold"
      );
      console.log("%cApp version: " + this.showVersion, "line-height: 3em; padding: 0.5em; text-align: center; border: 1px dotted #aaa; font-size: 14px;");
    });
  }
}
