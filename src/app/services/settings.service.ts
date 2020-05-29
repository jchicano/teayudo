import { Plugins } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Injectable } from '@angular/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public debugMode: boolean;
  public version: string;
  public DEBUG_MODE_NECESSARY_CLICKS = 10;
  public hideTutorialCard: boolean;
  public autoPlaySchedule: boolean;

  constructor(
    private appVersion: AppVersion
  ) {
    this.debugMode = false;
    this.appVersion.getVersionNumber().then((v) => this.version = v);
    this.hideTutorialCard = false;
    this.autoPlaySchedule = false;
  }

  async checkHideTutorialCard() {
    const ret = await Storage.get({ key: 'settings_hide_tutorial_card' });
    if (ret.value === 'true') {
      console.log('HideTutorialCard is true');
      this.hideTutorialCard = true;
    } else if (ret.value === 'false') {
      console.log('HideTutorialCard is false');
      this.hideTutorialCard = false;
    } else if (ret.value === null) {
      console.log('HideTutorialCard set to true');
      await Storage.set({
        key: 'settings_hide_tutorial_card',
        value: 'false'
      });
      this.hideTutorialCard = false;
    }
  }

  async checkAutoPlaySchedule() {
    const ret = await Storage.get({ key: 'settings_autoplay_schedule' });
    if (ret.value === 'true') {
      console.log('AutoPlaySchedule is true');
      this.autoPlaySchedule = true;
    } else if (ret.value === 'false') {
      console.log('AutoPlaySchedule card is false');
      this.autoPlaySchedule = false;
    } else if (ret.value === null) {
      console.log('AutoPlaySchedule card set to false');
      await Storage.set({
        key: 'settings_autoplay_schedule',
        value: 'false'
      });
      this.autoPlaySchedule = false;
    }
  }

  async saveHideTutorialCardChange() {
    await Storage.set({
      key: 'settings_hide_tutorial_card',
      value: this.hideTutorialCard + ''
    });
  }

  async saveAutoPlaySchedule() {
    await Storage.set({
      key: 'settings_autoplay_schedule',
      value: this.autoPlaySchedule + ''
    });
  }

}
