import { AuthService } from './../services/auth.service';
import { LoginModalPage } from './../modals/login-modal/login-modal.page';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DefaultAlertModule } from './../custom-modules/default-alert/default-alert.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, Platform, AlertController, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Component({
  selector: 'app-tutorial-slides',
  templateUrl: './tutorial-slides.page.html',
  styleUrls: ['./tutorial-slides.page.scss'],
})
export class TutorialSlidesPage implements OnInit {

  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  slides = [
    {
      img: 'assets/img/slides/add.svg',
      title: 'Crea un alumno'
    },
    {
      img: 'assets/img/slides/prepare.svg',
      title: 'Asígnale un horario'
    },
    {
      img: 'assets/img/slides/play.svg',
      title: 'Reprodúcelo'
    },
    {
      img: 'assets/img/slides/next.svg',
      title: '¿Listo para empezar?'
    }
  ];

  @ViewChild('slidesElement', { static: false }) ionSlides: IonSlides;
  public disablePrevBtn = true;
  public disableNextBtn = false;
  private subscription: Subscription;

  constructor(
    private screenOrientation: ScreenOrientation,
    private alertD: DefaultAlertModule,
    private platform: Platform,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    protected auth: AuthService
  ) { }

  ngOnInit() {
    console.log('Fijando orientacion a Portrait...');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
      .then((e) => console.log('Fijada orientacion Portrait: ' + e))
      .catch((e) => console.log('Error al fijar orientacion: ' + e));
  }


  ionViewWillEnter() {
    this.ionSlides.slideTo(0);
  }

  ionViewDidEnter() {
    // NOTE https://stackoverflow.com/a/58736680
    // Para que funcione el boton atras al salir de la app
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      const ret = Storage.get({ key: 'did_tutorial' });
      console.log('this:' + ret);
      ret.then((e) => {
        if (e.value === 'true') { // Si ya se ha visto antes el tutorial se volverá atrás
          this.router.navigate(['/home'])
        }
        else navigator['app'].exitApp(); // Si es la primera vez que se abre la app se cerrara
      })
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  // NOTE https://stackoverflow.com/a/55480623/10387022
  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  nextSlide() {
    this.ionSlides.slideNext();
  }

  previousSlide() {
    this.ionSlides.slidePrev();
  }

  startApp() {
    this.router
      .navigate(['/home'])
      .then(() => Storage.set({ key: 'did_tutorial', value: 'true' }));
  }

  async confirmation() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Si no inicias sesión algunas características no estarán disponibles',
      backdropDismiss: false,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('Dialog Okay');
            this.startApp();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Dialog Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  async showModalLogin() {
    const modal = await this.modalController.create({
      component: LoginModalPage,
      animated: true,
      swipeToClose: true,
      mode: 'ios'
    });
    return await modal.present();
  }

}


