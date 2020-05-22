import { AppVersion } from '@ionic-native/app-version/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public debugMode: boolean;
  public version: string;
  public DEBUG_MODE_NECESSARY_CLICKS = 10;

  constructor(
    private appVersion: AppVersion
  ) {
    this.debugMode = false;
    this.appVersion.getVersionNumber().then((v) => this.version = v);
  }

}
