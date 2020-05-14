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

  saveEmail() {
    console.log('Save email');
    console.log('email a guardar: ' + this.email);
    if (this.email === '' || this.currentPassword === '') {
      this.toastC.show('Rellena todos los campos');
    } else {
      this.auth.updateEmail(this.email, this.currentPassword)
        .subscribe((e) => {
          switch (e) {
            case 'password-format':
              this.toastC.show('La contraseña no cumple los requisitos de seguridad');
              console.log('La contraseña no cumple los requisitos de seguridad');
              break;
            case 'credential-error':
              console.log('Error al re-autenticar el usuario');
              break;
            case 'email-format':
              this.toastC.show('El correo electrónico no es válido');
              console.log('Formato de email no valido');
              break;
            case 'updating-error':
              this.toastC.show('Error al actualizar el correo electrónico');
              console.log('Error al actualizar el email');
              break;
            case 'updating-success':
              this.toastC.show('Correo electrónico actualizado con éxito');
              console.log('Email actualizado correctamente');
              break;
            default: break;
          }
        });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
