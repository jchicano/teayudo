import { CelebrateModule } from './custom-modules/celebrate/celebrate.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
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
import { environment } from "src/environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
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
    CelebrateModule
  ],
  providers: [
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    NetworkService,
    AppVersion,
    ScreenOrientation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
