import { UserService } from './../services/user.service';
import { User } from './../model/User';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SettingsService } from './../services/settings.service';
import { CustomLoadingModule } from './../custom-modules/custom-loading/custom-loading.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomToastModule } from './../custom-modules/custom-toast/custom-toast.module';
import { AuthService } from './../services/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SettingsModalPage } from '../modals/settings-modal/settings-modal.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  // NOTE no usado en ionic 5 https://commentedcoding.com/how-to-create-a-settings-page-with-customizable-font-family-in-ionic-5-steps/

  private subscription: Subscription;
  public accountSelected: boolean;
  public generalSelected: boolean;
  public aboutSelected: boolean;
  public accountForm: FormGroup;
  public accountData: User;
  private cliksEnableDebug: number;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    public auth: AuthService,
    private userS: UserService,
    private toastC: CustomToastModule,
    private formBuilder: FormBuilder,
    private loadingC: CustomLoadingModule,
    public settings: SettingsService,
    private clipboard: Clipboard,
    private modalController: ModalController
  ) {
    this.accountSelected = true;
    this.generalSelected = false;
    this.aboutSelected = false;
    this.cliksEnableDebug = 0;
  }

  ngOnInit() {
    this.accountData = {
      displayName: this.auth.user.displayName,
      email: this.auth.user.email,
      userId: this.auth.user.userId,
      imageUrl: this.auth.user.imageUrl,
      guest: this.auth.isGuest()
    };
    this.initAccountForm();
  }

  // NOTE https://stackoverflow.com/a/58736680
  // Para que funcione el boton atras al salir de la app
  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      this.navCtrl.navigateBack('/home');
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  initAccountForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['',
        [Validators.required]
      ],
      accountEmail: ['',
        [Validators.required,
        Validators.pattern(this.userS.emailRegex)]
      ],
      accountUUID: [
        { value: this.accountData.userId, disabled: true },
        [Validators.required]
      ]
    });
  }

  public isEmailVerified(): boolean {
    return this.auth.isEmailAddressVerified();
  }

  public sendEmail(): void {
    this.auth.sendVerificationEmail()
      .then(() => {
        this.toastC.show('Email de verificación enviado');
      })
      .catch(() => {
        this.toastC.show('Error al enviar email de verificación');
      });
  }

  // debugSwitched() {
  //   console.log('Debug mode switched to ' + this.settings.debugMode);
  // }

  enableDebugMode() {
    this.cliksEnableDebug++;
    if (this.cliksEnableDebug < this.settings.DEBUG_MODE_NECESSARY_CLICKS) {
      this.toastC.show(this.settings.DEBUG_MODE_NECESSARY_CLICKS - this.cliksEnableDebug + ' pasos restantes del modo debug'); // X steps away from debug mode
    }
    if (this.cliksEnableDebug >= this.settings.DEBUG_MODE_NECESSARY_CLICKS) {
      console.log('Debug mode switched to ' + this.settings.debugMode);
      this.settings.debugMode = true;
      this.toastC.show('Modo debug activado');
    }
  }

  segmentChanged($ev: any) {
    // console.log('Segment changed', $ev);
    switch ($ev.detail.value) {
      case 'account':
        this.accountSelected = true;
        this.generalSelected = false;
        this.aboutSelected = false;
        break;
      case 'general':
        this.accountSelected = false;
        this.generalSelected = true;
        this.aboutSelected = false;
        break;
      case 'about':
        this.accountSelected = false;
        this.generalSelected = false;
        this.aboutSelected = true;
        break;
      default: break;
    }
  }

  public copyUUID() {
    this.clipboard.copy(this.auth.user.userId);
  }

  async openModal(whatToDo: string) {
    const modal = await this.modalController.create({
      component: SettingsModalPage,
      componentProps: {
        'action': whatToDo
      },
      animated: true,
      mode: 'ios',
      swipeToClose: true,
      cssClass: 'roundedModal'
    });
    return await modal.present();
  }

}
