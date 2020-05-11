import { LoginModalPage } from './modals/login-modal/login-modal.page';
import { CustomToastModule } from './custom-modules/custom-toast/custom-toast.module';
import { CustomLoadingModule } from './custom-modules/custom-loading/custom-loading.module';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NetworkService } from './services/network.service';
import { Plugins } from '@capacitor/core';
import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

const { SplashScreen } = Plugins;
const { Storage } = Plugins;

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
    protected network: NetworkService,
    private appVersion: AppVersion,
    protected router: Router,
    protected auth: AuthService,
    private loadingC: CustomLoadingModule,
    private toastC: CustomToastModule,
    private modalController: ModalController
  ) {
    SplashScreen.show({
      showDuration: 5000,
      autoHide: true
    });
    this.initializeApp();
    this.appVersion.getVersionNumber().then(v => this.showVersion = v);
    this.checkTutorial();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      // NOTE contenido eliminado https://medium.com/@prashantg9912/how-to-add-beautiful-lottie-splashsceen-to-ionic-app-7fdbc00f6cea
      // NOTE icon & splash android: https://www.joshmorony.com/adding-icons-splash-screens-launch-images-to-capacitor-projects/ && https://apetools.webprofusion.com/#/tools/imagegorilla
      console.log(
        "%cTEAyudo",
        "color:#56a3a6;font-family:Roboto;font-size:4rem;font-weight:bold"
      );
      console.log("%cApp version: " + this.showVersion, "line-height: 3em; padding: 0.5em; text-align: center; border: 1px dotted #aaa; font-size: 14px;");
      await this.auth.checkSession();
    });
  }

  // NOTE https://forum.ionicframework.com/t/how-to-show-only-on-first-time-opening-app-localstorage/79059/3
  // Mostramos el tutorial la primera vez que se abre la app
  async checkTutorial() {
    const ret = await Storage.get({ key: 'did_tutorial' });
    if (ret.value === 'true') {
      console.log('Tutorial already seen');
    }
    else if (ret.value === 'false') {
      console.log('Tutorial should open 1');
      this.router.navigate(['/tutorial']);
    }
    else if (ret.value === null) {
      console.log('Tutorial should open 2');
      this.router.navigate(['/tutorial']);
      await Storage.set({
        key: 'did_tutorial',
        value: 'false'
      });
    }
  }

  public async logout() {
    this.loadingC.show('');
    await this.auth.logout()
      .then(() => {
        this.toastC.show('Sesión cerrada');
        if (this.router.url === '/list') {
          this.router.navigate(['/home']); // Para que el usuario anónimo no vea los alumnos del que estaba logueado
        }
      })
      .catch(() => {
        this.toastC.show('Error al cerrar sesión');
      })
      .finally(() => this.loadingC.hide());
  }

  async login() {
    const modal = await this.modalController.create({
      component: LoginModalPage,
      swipeToClose: true,
      mode: 'ios'
    });
    return await modal.present();
  }

}
