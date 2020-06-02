import { UserService } from './../../services/user.service';
import { CustomLoadingModule } from './../../custom-modules/custom-loading/custom-loading.module';
import { CustomToastModule } from './../../custom-modules/custom-toast/custom-toast.module';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './../../custom-validators/confirm-password.validator';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  userdata: any;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private userS: UserService,
    private router: Router,
    private toastC: CustomToastModule,
    private loadingC: CustomLoadingModule,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      loginEmail: ['', [
        Validators.required,
        Validators.pattern(this.userS.emailRegex)]
      ],
      loginPassword: ['', [
        Validators.required,
        Validators.pattern(this.userS.passRegex),
        Validators.minLength(6)]
      ]
    });
  }

  initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      registerName: ['', [
        Validators.required],
      ],
      registerEmail: ['', [
        Validators.required,
        Validators.pattern(this.userS.emailRegex)]
      ],
      registerPassword: ['', [
        Validators.required,
        Validators.pattern(this.userS.passRegex),
        Validators.minLength(6)]
      ],
      registerPasswordConfirm: ['', [
        Validators.required,
        Validators.pattern(this.userS.passRegex),
        Validators.minLength(6)]
      ]
    }, {
      validator: ConfirmPasswordValidator('registerPassword', 'registerPasswordConfirm')
    });
  }

  onSubmitLogin() {
    this.loadingC.show('');
    this.userdata = this.saveLoginUserdata();
    this.auth.login(this.userdata)
      .then(() => {
        console.log('Redirecting to home...');
        this.toastC.show('Sesión iniciada');
        this.dismiss();
        this.router.navigate(['/home'])
          .catch((e) => {
            console.log('Error al redirigir');
            console.log(e);
          });
      })
      .catch((error) => {
        console.log(error);
        switch (error.code) {
          case 'auth/invalid-email':
            this.toastC.show('El correo electrónico no es válido');
            break;
          case 'auth/user-not-found':
            this.toastC.show('El usuario no existe');
            break;
          case 'auth/wrong-password':
            this.toastC.show('Contraseña incorrecta');
            break;
          default:
            this.toastC.show('Error al iniciar sesión');
            break;
        }
      })
      .finally(() => { this.loadingC.hide(); });
  }

  onSubmitRegister() {
    console.log('Registering user...');
    this.loadingC.show('');
    this.userdata = this.saveRegisterUserdata();
    this.auth.register(this.userdata)
      .then(() => {
        this.toastC.show('Registrado con éxito');
        this.dismiss();
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        // console.log(error);
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.toastC.show('El correo electrónico ya está en uso por otra cuenta');
            break;
          case 'auth/invalid-email':
            this.toastC.show('El correo electrónico no es válido');
            break;
          case 'auth/weak-password':
            this.toastC.show('La contraseña no es lo sufientemente fuerte');
            break;
          default:
            this.toastC.show('Error al realizar el registro');
            break;
        }
      })
      .finally(() => { this.loadingC.hide(); });
  }

  saveLoginUserdata() {
    const saveUserdata = {
      email: this.loginForm.get('loginEmail').value,
      password: this.loginForm.get('loginPassword').value,
    };
    return saveUserdata;
  }

  saveRegisterUserdata() {
    const saveUserdata = {
      name: this.registerForm.get('registerName').value,
      email: this.registerForm.get('registerEmail').value,
      password: this.registerForm.get('registerPassword').value,
    };
    return saveUserdata;
  }

  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Restablecer contraseña',
      inputs: [
        {
          name: 'emailReset',
          type: 'email',
          placeholder: 'Dirección de correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log('Confirm Ok: ' + alertData.emailReset);
            this.auth.resetPassword(alertData.emailReset)
              .then(() => {
                this.toastC.show('Email de recuperación enviado');
              })
              .catch((e) => {
                this.toastC.show('Error al enviar email de recuperación');
                console.log(e);
              });
          }
        }
      ]
    });

    await alert.present();
  }


  dismiss() {
    this.modalController.dismiss();
  }

}
