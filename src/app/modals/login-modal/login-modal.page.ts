import { CustomToastModule } from './../../custom-modules/custom-toast/custom-toast.module';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './../../custom-validators/confirm-password.validator';
import { AuthService } from './../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';

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
    private router: Router,
    private toastC: CustomToastModule
  ) { }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      loginEmail: ['', [
        Validators.required,
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
      ],
      loginPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
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
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
      ],
      registerPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)]
      ],
      registerPasswordConfirm: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)]
      ]
    }, {
      validator: ConfirmPasswordValidator('registerPassword', 'registerPasswordConfirm')
    });
  }

  onSubmitLogin() {
    this.userdata = this.saveLoginUserdata();
    this.auth.login(this.userdata)
      .then(() => {
        console.log('Redirecting to home...');
        this.toastC.showTop('Sesión iniciada', 2000);
        this.dismiss();
        this.router.navigate(['/home'])
          .catch((e) => {
            console.log('Error al redirigir');
            console.log(e);
          });
      })
      .catch(() => {
        this.toastC.showTop('Error al iniciar sesión');
      });
  }

  onSubmitRegister() {
    this.userdata = this.saveRegisterUserdata();
    console.log('Al registrarnos:');
    console.log(this.userdata);
    this.auth.register(this.userdata)
      .then(() => {
        this.toastC.showTop('Registrado con éxito', 2000);
        this.dismiss();
        this.router.navigate(['/home']);
      })
      .catch(() => {
        this.toastC.showTop('Error al realizar el registro');
      });
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

  isAuth() {
    return this.auth.isAuthenticated();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
