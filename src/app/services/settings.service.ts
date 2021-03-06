import { Plugins } from '@capacitor/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Injectable } from '@angular/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public DEBUG_MODE_NECESSARY_CLICKS = 10;
  public debugMode: boolean;
  public version: string;
  public hideTutorialCard: boolean;
  public autoPlaySchedule: boolean;
  public switchFontOnShowSchedule: boolean;
  public showConfettiOnFinish: boolean;

  constructor(
    private appVersion: AppVersion
  ) {
    this.debugMode = false;
    this.appVersion.getVersionNumber().then((v) => this.version = v);
    this.hideTutorialCard = false;
    this.autoPlaySchedule = false;
    this.switchFontOnShowSchedule = true;
    this.showConfettiOnFinish = true;
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

  async checkSwitchFontOnShowSchedule() {
    const ret = await Storage.get({ key: 'settings_switch_font' });
    if (ret.value === 'true') {
      console.log('switchFontOnShowSchedule is true');
      this.switchFontOnShowSchedule = true;
    } else if (ret.value === 'false') {
      console.log('switchFontOnShowSchedule card is false');
      this.switchFontOnShowSchedule = false;
    } else if (ret.value === null) {
      console.log('switchFontOnShowSchedule card set to false');
      await Storage.set({
        key: 'settings_switch_font',
        value: 'true'
      });
      this.switchFontOnShowSchedule = false;
    }
  }

  async checkShowConfettiOnFinish() {
    const ret = await Storage.get({ key: 'settings_show_confetti' });
    if (ret.value === 'true') {
      console.log('showConfettiOnFinish is true');
      this.showConfettiOnFinish = true;
    } else if (ret.value === 'false') {
      console.log('showConfettiOnFinish card is false');
      this.showConfettiOnFinish = false;
    } else if (ret.value === null) {
      console.log('showConfettiOnFinish card set to false');
      await Storage.set({
        key: 'settings_show_confetti',
        value: 'true'
      });
      this.showConfettiOnFinish = false;
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

  async saveSwitchFontOnShowSchedule() {
    await Storage.set({
      key: 'settings_switch_font',
      value: this.switchFontOnShowSchedule + ''
    });
  }

  async saveShowConfettiOnFinish() {
    await Storage.set({
      key: 'settings_show_confetti',
      value: this.showConfettiOnFinish + ''
    });
  }

}
