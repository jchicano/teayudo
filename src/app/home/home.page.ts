import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private subscription: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private screenOrientation: ScreenOrientation
  ) { }

  ngOnInit() {
    console.log('Fijando orientacion a Portrait...');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
      .then((e) => console.log('Fijada orientacion Portrait: ' + e))
      .catch((e) => console.log('Error al fijar orientacion: ' + e));
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

  openTutorial() {
    // Storage.set({ key: 'did_tutorial', value: 'false' });
    this.router.navigateByUrl('/tutorial');
  }

}
