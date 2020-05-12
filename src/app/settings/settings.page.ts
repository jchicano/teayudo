import { User } from './../model/User';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SettingsService } from './../services/settings.service';
import { CustomLoadingModule } from './../custom-modules/custom-loading/custom-loading.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomToastModule } from './../custom-modules/custom-toast/custom-toast.module';
import { AuthService } from './../services/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';

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

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    public auth: AuthService,
    private toastC: CustomToastModule,
    private formBuilder: FormBuilder,
    private loadingC: CustomLoadingModule,
    public settings: SettingsService,
    private clipboard: Clipboard
  ) {
    this.accountSelected = true;
    this.generalSelected = false;
    this.aboutSelected = false;
  }

  ngOnInit() {
    this.accountData = {
      displayName: this.auth.displayName,
      email: this.auth.email,
      userId: this.auth.UID,
      imageUrl: this.auth.imageUrl,
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
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
      ],
      accountUUID: [
        { value: this.accountData.userId, disabled: true },
        [Validators.required]
      ]
    });
  }

  onSubmitAccount() {
    this.loadingC.show('');
    this.accountData = this.saveAccountData();
    this.auth.user = this.accountData;
    this.auth.saveSession(this.auth.user);
    // TODO actualizar en firebase
    this.loadingC.hide();
  }

  saveAccountData() {
    let uuid = this.auth.UID;
    if (this.accountForm.get('accountUUID')) {
      uuid = this.accountForm.get('accountUUID').value;
    }
    const accountData: User = {
      displayName: this.accountForm.get('accountName').value,
      email: this.accountForm.get('accountEmail').value,
      userId: uuid,
      imageUrl: '', // TODO con la imagen que seleccione el usuario
      guest: false
    };
    return accountData;
  }

  public isEmailVerified(): boolean {
    return this.auth.isEmailAddressVerified();
  }

  public sendEmail(): void {
    this.auth.sendVerificationEmail()
      .then(() => {
        this.toastC.show('Email de recuperación enviado');
      })
      .catch(() => {
        this.toastC.show('Error al enviar email de recuperación');
      });
  }

  debugSwitched() {
    console.log('Debug mode switched to ' + this.settings.debugMode);
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
    this.clipboard.copy(this.auth.UID);
  }

}
