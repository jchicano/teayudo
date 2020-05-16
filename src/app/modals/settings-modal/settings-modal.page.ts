import { Router } from '@angular/router';
import { CustomLoadingModule } from './../../custom-modules/custom-loading/custom-loading.module';
import { UserService } from './../../services/user.service';
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
  public showPasswordForm: boolean;
  public showNameForm: boolean;
  public showAvatarForm: boolean;
  public showDeleteForm: boolean;

  public email: string;
  public currentPassword: string;
  public newPassword: string;
  public newPasswordConfirm: string;
  public name: string;


  constructor(
    protected auth: AuthService,
    private userS: UserService,
    private loadingC: CustomLoadingModule,
    private modalController: ModalController,
    private toastC: CustomToastModule,
    private router: Router
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.initVars();
    this.checkAction();
  }

  initVars() {
    this.showEmailForm = false;
    this.showPasswordForm = false;
    this.showNameForm = false;
    this.showAvatarForm = false;
    this.showDeleteForm = false;

    this.email = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
    this.name = '';
  }

  checkAction() {
    switch (this.action) {
      case 'updateEmail':
        this.showEmailForm = true;
        this.title = 'Actualizar dirección de correo electrónico';
        break;
      case 'updatePassword':
        this.showPasswordForm = true;
        this.title = 'Cambiar contraseña';
        break;
      case 'updateName':
        this.showNameForm = true;
        this.title = 'Cambiar nombre';
        break;
      case 'updateAvatar':
        this.showAvatarForm = true;
        this.title = 'Cambiar foto de perfil';
        // TODO
        break;
      case 'deleteUser':
        this.showDeleteForm = true;
        this.title = 'Eliminar usuario';
        // TODO mostrar alertController?
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
    if (this.showNameForm) {
      this.saveName();
    }
    if (this.showAvatarForm) {
      // TODO
    }
    if (this.showDeleteForm) {
      this.deleteUser();
    }
  }

  saveEmail() {
    console.log('Saving email...');
    // console.log('Email a guardar:', this.email);
    this.loadingC.show('');
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
            this.dismiss();
            break;
          default: break;
        }
        this.loadingC.hide();
      });
  }

  savePassword() {
    console.log('Saving password...');
    this.loadingC.show('');
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
            this.dismiss();
            break;
          default: break;
        }
        this.loadingC.hide();
      });
  }

  saveName() {
    console.log('Updating name...');
    if (this.name !== '') {
      this.loadingC.show('');
      this.userS.updateName(this.auth.user.userId, this.name)
        .then(() => {
          this.auth.user.displayName = this.name;
          this.toastC.show('Nombre cambiado con éxito');
          console.log('Nombre cambiado correctamente');
          this.dismiss();
        })
        .catch((e) => {
          console.log(e);
          this.toastC.show('Error al cambiar el nombre');
          console.log('Error al cambiar el nombre');
        })
        .finally(() => {
          this.loadingC.hide();
        });
    } else {
      this.toastC.show('Rellena el campo');
    }
  }

  async deleteUser() {
    console.log('Deleting user...');
    // await this.userS.deleteUser(this.auth.user.userId)
    //   .subscribe((students) => {
    //     const studentsFromThisTeacher: string[] = [];
    //     const scheduleFromThisStudent: string[] = [];
    //     students.forEach((student) => { // Obtengo los alumnos del profesor
    //       // console.log(student.id);
    //       // console.log(student.data());
    //       studentsFromThisTeacher.push(student.id);
    //       scheduleFromThisStudent.push(student.data().collectionId);
    //     });
    //     studentsFromThisTeacher.forEach((s, index) => { // Obtengo el horario de cada alumno
    //       console.log(s);
    //       this.fireStore.collection(environment.collection.card, ref => ref.where('collectionId', '==', scheduleFromThisStudent[index])).get();
    //     });
    //   });


    if (this.currentPassword !== '') {
      this.loadingC.show('');
      this.userS.deleteUserCascade(this.auth.user.userId, this.currentPassword)
        .subscribe((e) => {
          switch (e) {
            case 'password-format':
              this.toastC.show('La contraseña no cumple los requisitos de seguridad');
              console.log('La contraseña no cumple los requisitos de seguridad');
              break;
            case 'credential-error':
              console.log('Error al re-autenticar el usuario');
              break;
            case 'error-deleting-schedule':
              this.toastC.show('Error al eliminar el horario del alumno');
              console.log('Error al eliminar el horario del alumno');
              break;
            case 'error-deleting-student':
              this.toastC.show('Error al eliminar el alumno');
              console.log('Error al eliminar el alumno');
              break;
            case 'error-deleting-teacher':
              this.toastC.show('Error al eliminar el profesor');
              console.log('Error al eliminar el profesor');
              break;
            case 'error-deleting-user':
              this.toastC.show('Error al eliminar el usuario');
              console.log('Error al eliminar el usuario');
              break;
            case 'success-deleting-user':
              this.toastC.show('Usuario eliminado con éxito');
              console.log('Usuario eliminado correctamente');
              this.dismiss();
              this.auth.logout()
                .then(() => {
                  this.toastC.show('Sesión cerrada');
                  this.router.navigate(['/home'])
                    .then(() => {
                      this.loadingC.hide();
                    });
                })
                .catch(() => {
                  this.toastC.show('Error al cerrar sesión');
                })
                .finally(() => this.loadingC.hide());
              break;
            default: break;
          }
          this.loadingC.hide();
        });
    } else {
      this.toastC.show('Rellena el campo');
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
