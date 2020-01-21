import { FontService } from './../services/font.service';
import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

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
    private events: Events,
    private fontS: FontService
  ) {
    this.fontList = fontS.getAvailableFonts();
  }

  ngOnInit() {
  }
  
  ionViewWillEnter(){
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
