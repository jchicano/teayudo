import { SettingsService } from './../services/settings.service';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    public settings: SettingsService
  ) { }

  ngOnInit() { }

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
