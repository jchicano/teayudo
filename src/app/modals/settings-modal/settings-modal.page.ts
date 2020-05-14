import { User } from './../../model/User';
import { CustomToastModule } from './../../custom-modules/custom-toast/custom-toast.module';
import { ModalController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {

  // Data passed in by componentProps
  @Input() action: string;

  public title: string;

  public showEmailForm: boolean;
  public showNameForm: boolean;
  public showPasswordForm: boolean;
  public showAvatarForm: boolean;
  public showDeleteForm: boolean;

  public email: string;
  public currentPassword: string;
  public newPassword: string;
  public newPasswordConfirm: string;


  constructor(
    protected auth: AuthService,
    private modalController: ModalController,
    private toastC: CustomToastModule
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.initVars();
    this.checkAction();
  }

  initVars() {
    this.showEmailForm = false;
    this.showNameForm = false;
    this.showPasswordForm = false;
    this.showAvatarForm = false;
    this.showDeleteForm = false;

    this.email = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }

  checkAction() {
    switch (this.action) {
      case 'updateEmail':
        this.showEmailForm = true;
        this.title = 'Actualizar dirección de correo electrónico';
        break;
      case 'updateName':
        this.showNameForm = true;
        this.title = 'Cambiar nombre';
        break;
      case 'updatePassword':
        this.showPasswordForm = true;
        this.title = 'Cambiar contraseña';
        break;
      case 'updateAvatar':
        this.showAvatarForm = true;
        this.title = 'Cambiar foto de perfil';
        // TODO
        break;
      case 'deleteUser':
        this.showDeleteForm = true;
        this.title = 'Eliminar usuario';
        // TODO https://ionicframework.com/docs/api/action-sheet
        break;
      default: break;
    }
  }

  saveData() {
    if (this.showEmailForm) {
      this.saveEmail();
    }
    if (this.showPasswordForm) {
      this.savePassword();
    }
  }

  saveEmail() {
    console.log('Saving email...');
    // console.log('Email a guardar:', this.email);
    this.auth.updateEmail(this.email, this.currentPassword)
      .subscribe((e) => {
        switch (e) {
          case 'email-format':
            this.toastC.show('El correo electrónico no es válido');
            console.log('Formato de email no valido');
            break;
          case 'password-format':
            this.toastC.show('La contraseña no cumple los requisitos de seguridad');
            console.log('La contraseña no cumple los requisitos de seguridad');
            break;
          case 'credential-error':
            console.log('Error al re-autenticar el usuario');
            break;
          case 'update-error':
            this.toastC.show('Error al actualizar el correo electrónico');
            console.log('Error al actualizar el email');
            break;
          case 'update-success':
            this.toastC.show('Correo electrónico actualizado con éxito');
            console.log('Email actualizado correctamente');
            // Guardo el usuario en local storage
            const user: User = {
              email: this.email,
              displayName: this.auth.user.displayName,
              imageUrl: this.auth.user.imageUrl,
              userId: this.auth.user.userId,
              guest: this.auth.isGuest(),
            };
            this.auth.saveSession(user)
              .then(() => {
                this.auth.user.email = this.email;
              });
            break;
          default: break;
        }
      });
  }

  savePassword() {
    console.log('Saving password...');
    this.auth.updatePassword(this.currentPassword, this.newPassword, this.newPasswordConfirm)
      .subscribe((e) => {
        switch (e) {
          case 'password-format':
            this.toastC.show('La contraseña no cumple los requisitos de seguridad');
            console.log('La contraseña no cumple los requisitos de seguridad');
            break;
          case 'password-mismatch':
            this.toastC.show('Las contraseñas no coinciden');
            console.log('Las contraseñas no coinciden');
            break;
          case 'credential-error':
            console.log('Error al re-autenticar el usuario');
            break;
          case 'update-error':
            this.toastC.show('Error al actualizar la contraseña');
            console.log('Error al actualizar la contraseña');
            break;
          case 'update-success':
            this.toastC.show('Contraseña actualizada con éxito');
            console.log('Contraseña actualizada correctamente');
            break;
          default: break;
        }
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
