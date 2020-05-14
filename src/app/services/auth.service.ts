import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Plugins } from '@capacitor/core';
import { UserService } from './user.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from '../model/User';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;

  public emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public passRegex: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

  constructor(
    private local: NativeStorage,
    private userS: UserService,
    private AFauth: AngularFireAuth
  ) {
    this.AFauth.auth.useDeviceLanguage(); // Los mensajes de firebase cambiaran segun el idioma del dispositivo
  }

  register(userdata): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(userdata.email, userdata.password)
        .then((d) => {
          // console.log(d);
          if (d && d.user) {
            this.userS.createUser(d.user.uid, userdata.name);
            //////
            const user: User = {
              email: d.user.email,
              displayName: userdata.name,
              imageUrl: '',
              userId: d.user.uid,
              guest: false
            };
            this.user = user;
            this.saveSession(user);
            this.sendVerificationEmail();
            resolve(true);
          }
          else reject(false);
        })
        .catch((e) => {
          console.log(e);
          reject(false);
        });
    });
  }

  login(userdata) {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.signInWithEmailAndPassword(userdata.email, userdata.password)
        .then(async (d) => {
          // console.log(d);
          if (d && d.user) {
            await this.userS.getUserByID(d.user.uid)
              .subscribe((r) => {
                const name = r.data().name;
                // console.log(r.data());
                const user: User = {
                  email: d.user.email,
                  displayName: name,
                  imageUrl: '',
                  userId: d.user.uid,
                  guest: false
                };
                this.user = user;
                this.saveSession(user);
                resolve(true);
              });
          }
          else reject(false);
        })
        .catch((e) => {
          console.log(e);
          reject(false);
        });
    });
  }

  public async logout() {
    this.AFauth.auth.signOut();
    // this.user = null;
    const uuid = await (await Device.getInfo()).uuid;
    this.user = {
      email: '',
      displayName: '',
      imageUrl: '',
      userId: uuid,
      guest: true
    };
    await this.saveSession();
  }

  public isGuest(): boolean {
    // return this.user ? true : false;
    // return this.user.guest;
    return this.user ? this.user.guest : false;
    // return this.user ? this.user.guest : false;
  }

  /**
   * Almacena el usuario en local con el nombre 'user'
   * @param user
   */
  public async saveSession(user?: User) {
    if (user) {
      await this.local.setItem('user', user) // Await porque devuelve un promise, y bloqueamos la linea hasta que se complete
        .then((r) => {
          console.log('Variable local creada');
        })
        .catch((e) => {
          console.log('Error al crear variable local');
          console.log(e);
        });
    } else {
      await this.local.remove('user')
        .then((r) => {
          console.log('Variable local borrada');
        })
        .catch((e) => {
          console.log('Error al borrar variable local');
          console.log(e);
        });
    }
  }

  public async checkSession(): Promise<void> {
    if (!this.user) { // Todavia no se ha iniciado sesion
      try {
        this.user = await this.local.getItem('user'); // Recuperamos el usuario de local storage
      } catch (error) {
        // this.user = null;
        const uuid = await (await Device.getInfo()).uuid;
        this.user = {
          email: '',
          displayName: '',
          imageUrl: '',
          userId: uuid,
          guest: true
        };
      }
    }
  }

  resetPassword(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.sendPasswordResetEmail(email)
        .then(() => {
          // Email sent.
          resolve(true);
        }).catch((error) => {
          // An error happened.
          reject(false);
        });
    });
  }

  isEmailAddressVerified() {
    // return this.AFauth.auth.currentUser.emailVerified;
    return this.AFauth.auth.currentUser ? this.AFauth.auth.currentUser.emailVerified : false;
  }

  sendVerificationEmail(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.AFauth.auth.currentUser.sendEmailVerification()
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.log(e);
          reject(false);
        });
    });
  }

  updateEmail(newEmail: string, currentPassword: string): Observable<string> {
    return new Observable((observer) => {
      // Email & contrasena validos
      if (this.emailRegex.test(newEmail)) {
        if (this.passRegex.test(currentPassword)) {
          const cpUser = firebase.auth().currentUser;
          const credentials = this.createCredential(cpUser.email, currentPassword);
          // Reauthenticating here with the data above
          cpUser.reauthenticateWithCredential(credentials)
            .then((e) => {
              cpUser.updateEmail(newEmail)
                .then((e) => {
                  // Update successful.
                  observer.next('update-success');
                  observer.complete();
                }).catch((e) => {
                  // An error happened.
                  console.log(e);
                  observer.error('update-error');
                });
            })
            .catch((e) => {
              console.log(e);
              observer.error('credential-error');
            });
          // console.log(credentials);
        } else {
          observer.error('password-format');
        }

      } else {
        observer.error('email-format');
      }
    });
  }

  // NOTE https://stackoverflow.com/a/52075631
  updatePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string): Observable<string> {
    return new Observable((observer) => {
      // Contrasenas validas
      if (this.passRegex.test(oldPassword) && this.passRegex.test(newPassword)) {
        if (newPassword === newPasswordConfirm) {
          // First you get the current logged in user
          const cpUser = firebase.auth().currentUser;

          /*Then you set credentials to be the current logged in user's email
          and the password the user typed in the input named "old password"
          where he is basically confirming his password just like facebook for example.*/

          const credentials = this.createCredential(cpUser.email, oldPassword);

          // Reauthenticating here with the data above
          cpUser.reauthenticateWithCredential(credentials)
            .then((e) => {
              // TODO Comprobar validaciones contraseña confirmada
              /* Update the password to the password the user typed into the
                new password input field */
              cpUser.updatePassword(newPassword)
                .then((e) => {
                  //Success
                  observer.next('update-success');
                  observer.complete();
                })
                .catch((e) => {
                  //Failed
                  console.log(e);
                  observer.error('update-error');
                });
            })
            .catch((e) => {
              console.log(e);
              observer.error('credential-error');
            });
          // console.log(credentials);
        } else {
          observer.error('password-mismatch');
        }
      } else {
        observer.error('password-format');
      }
    });
  }

  createCredential(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    return credentials;
  }

  // get user(): User {
  //   return this.user;
  // }

  // set user(value: User) {
  //   this.user = value;
  // }

  // get UID(): string {
  //   return this.user ? this.user.userId : '';
  // }

  // set UID(value: string) {
  //   this.UID = value;
  // }

  // get email(): string {
  //   return this.user ? this.user.email : '';
  // }

  // set email(value: string) {
  //   this.email = value;
  // }

  get displayName(): string {
    return this.user ? this.user.displayName : '';
  }

  // set displayName(value: string) {
  //   this.displayName = value;
  // }

  get imageUrl(): string {
    return this.user ? this.user.imageUrl : '';
  }

  // set imageUrl(value: string) {
  //   this.imageUrl = value;
  // }

  getLocalVariableValue() {
    return this.local.getItem('user').then((val) => val);
  }

}
