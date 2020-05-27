import { environment } from './../../../environments/environment.prod';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { CustomLoadingModule } from './../../custom-modules/custom-loading/custom-loading.module';
import { UserService } from './../../services/user.service';
import { User } from './../../model/User';
import { CustomToastModule } from './../../custom-modules/custom-toast/custom-toast.module';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

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
  public newAvatarToUpload: Blob;
  public avatarURL: string;

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  downloadURL: Observable<string>;

  @ViewChild('imagen', { static: false }) imagen: ElementRef;
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;


  constructor(
    protected auth: AuthService,
    private userS: UserService,
    private loadingC: CustomLoadingModule,
    private modalController: ModalController,
    private toastC: CustomToastModule,
    private router: Router,
    private actionSheetController: ActionSheetController
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
    this.newAvatarToUpload = null;
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
        break;
      case 'deleteUser':
        this.showDeleteForm = true;
        this.title = 'Eliminar usuario';
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
      this.saveAvatar();
    }
    if (this.showDeleteForm) {
      this.deleteUser();
    }
  }

  saveEmail() {
    console.log('Saving email...');
    // console.log('Email a guardar:', this.email);
    if (this.email === this.auth.user.email) {
      this.toastC.show('El correo electrónico debe ser diferente');
    } else {
      this.loadingC.show('');
      this.auth.updateEmail(this.email, this.currentPassword)
        .subscribe(async (e) => {
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
              await this.auth.saveSession(user);
              this.auth.user.email = this.email;
              this.dismiss();
              break;
            default: break;
          }
          this.loadingC.hide();
        });
    }
  }

  savePassword() {
    console.log('Saving password...');
    this.loadingC.show('');
    this.auth.updatePassword(this.currentPassword, this.newPassword, this.newPasswordConfirm)
      .toPromise()
      .then((e) => {
        this.toastC.show('Contraseña actualizada con éxito');
        console.log('Contraseña actualizada correctamente');
        this.dismiss();
      })
      .catch((e) => {
        console.log(e);
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
            this.toastC.show('Error en las credenciales');
            console.log('Error al re-autenticar el usuario');
            break;
          case 'update-error':
            this.toastC.show('Error al actualizar la contraseña');
            console.log('Error al actualizar la contraseña');
            break;
          default: break;
        }
      })
      .finally(() => {
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

  saveAvatar() {
    console.log('Updating avatar...');
    if (this.newAvatarToUpload) {
      this.loadingC.show('');
      this.userS.uploadImage(this.auth.user.userId, this.newAvatarToUpload)
        .then((snapshot) => {
          console.log(snapshot);
          this.getAvatarURL();
          console.log('Image successfully added');
          this.toastC.show('Imagen actualizada');
          this.dismiss();
        })
        .catch((error) => {
          console.log(error);
          this.toastC.show('Ha ocurrido un error al actualizar el avatar');
        })
        .finally(() => this.loadingC.hide());
    } else {
      this.toastC.show('Primero debes subir una imagen');
    }
  }

  async deleteUser() {
    console.log('Deleting user...');
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
            case 'error-deleting-storage':
              this.toastC.show('Error al eliminar el avatar');
              console.log('Error al eliminar el avatar de storage');
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

  getFile(files) {
    console.log(files, files[0]);
    // NOTE https://stackoverflow.com/a/3814285
    // Establezco la previsualizacion de la imagen
    const fr = new FileReader();
    fr.onload = () => {
      this.imagen.nativeElement.src = fr.result; // Lo convierto a base64
    };
    fr.readAsDataURL(files[0]);

    // Redimensiono la imagen
    this.resizeImage(files[0], 200)
      .then((e) => {
        console.log(e);
        this.newAvatarToUpload = e;
      }).catch((e) => {
        console.log(e);
      });
  }

  // NOTE https://jsfiddle.net/ascorbic/wn655txt/2/
  resizeImage(file: File, maxWidth: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const scaleFactor = maxWidth / width; // NOTE https://zocada.com/compress-resize-images-javascript-browser/
        if (width <= maxWidth) {
          resolve(file);
        }
        let newWidth;
        let newHeight;
        if (width > height) {
          newHeight = height * (maxWidth / width); // To maintain aspect ratio
          newWidth = maxWidth;
        } else {
          newHeight = height * scaleFactor;
          newWidth = width * (newHeight / height);
        }
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, newWidth, height * scaleFactor);
        canvas.toBlob(resolve, file.type);
        resolve(file);
      };
      image.onerror = reject;
    });
  }

  getAvatarURL(): void {
    console.log('Getting avatar URL...');
    this.userS.getDownloadURL(this.auth.user.userId)
      .then((url) => {
        // This can be downloaded directly Or inserted into an <img> element
        console.log(url);
        this.userS.updateAvatar(this.auth.user.userId, url)
          .then(async (e) => {
            console.log('AvatarURL en BD actualizado');
            this.avatarURL = url;
            this.auth.user.imageUrl = url;
            await this.auth.saveSession(this.auth.user);
          })
          .catch((error) => {
            console.log(error);
          });
      }).catch(async (error) => {
        console.log(error);
        this.avatarURL = environment.defaultAvatarURL;
        this.auth.user.imageUrl = environment.defaultAvatarURL;
        await this.auth.saveSession(this.auth.user);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            console.log('File doesnt exist');
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log('User doesnt have permission to access the object');
            break;
          case 'storage/canceled':
            // User canceled the upload
            console.log('User canceled the upload');
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('Unknown error occurred, inspect the server response');
            break;
        }
      });
  }

  deleteAvatar() {
    this.loadingC.show('');
    this.userS.deleteImage(this.auth.user.userId)
      .then(() => {
        console.log('Imagen eliminada de Firebase Storage');
        this.auth.user.imageUrl = environment.defaultAvatarURL;
        this.userS.updateAvatar(this.auth.user.userId, environment.defaultAvatarURL)
          .then(() => {
            this.getAvatarURL();
            console.log('Registro modificado en BD');
            this.toastC.show('Imagen eliminada correctamente');
            this.dismiss();
          })
          .catch((error) => {
            console.log(error);
            this.toastC.show('Error al actualizar el registro');
          });
      })
      .catch((error) => {
        console.log(error);
        this.toastC.show('Error al eliminar la imagen');
      })
      .finally(() => this.loadingC.hide());
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      buttons: [{
        text: 'Eliminar foto',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Eliminar foto clicked');
          this.deleteAvatar();
        }
      }, {
        text: 'Subir foto',
        icon: 'cloud-upload',
        handler: () => {
          console.log('Subir foto clicked');
          const el: HTMLElement = this.inputFile.nativeElement;
          el.click();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancelar clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}