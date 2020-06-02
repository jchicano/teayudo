import { AngularFireStorage } from '@angular/fire/storage';
import { LoginModalPage } from './modals/login-modal/login-modal.page';
import { AngularFireAuth } from '@angular/fire/auth';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CelebrateModule } from './custom-modules/celebrate/celebrate.module';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NetworkService } from './services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { DefaultAlertModule } from './custom-modules/default-alert/default-alert.module';
import { DefaultLoadingModule } from './custom-modules/default-loading/default-loading.module';
import { CustomLoadingModule } from './custom-modules/custom-loading/custom-loading.module';
import { CustomToastModule } from './custom-modules/custom-toast/custom-toast.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SettingsModalPage } from './modals/settings-modal/settings-modal.page';

@NgModule({
  declarations: [AppComponent, LoginModalPage, SettingsModalPage],
  entryComponents: [LoginModalPage, SettingsModalPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    CustomToastModule,
    CustomLoadingModule,
    DefaultLoadingModule,
    DefaultAlertModule,
    CelebrateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    NetworkService,
    AppVersion,
    AngularFireAuth,
    AngularFireStorage,
    NativeStorage,
    Clipboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
