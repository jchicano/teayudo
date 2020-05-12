import { AppVersion } from '@ionic-native/app-version/ngx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public debugMode: boolean;
  public version: string;

  constructor(
    private appVersion: AppVersion
  ) {
    this.debugMode = false;
    this.appVersion.getVersionNumber().then((v) => this.version = v);
  }

}
