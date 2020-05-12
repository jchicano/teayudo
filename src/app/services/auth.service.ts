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

  private currentUser: User;

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
            let user: User = {
              email: d.user.email,
              displayName: userdata.name,
              imageUrl: '',
              userId: d.user.uid,
              guest: false
            };
            this.currentUser = user;
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
                this.currentUser = user;
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
    // this.currentUser = null;
    const uuid = await (await Device.getInfo()).uuid;
    this.currentUser = {
      email: '',
      displayName: '',
      imageUrl: '',
      userId: uuid,
      guest: true
    };
    await this.saveSession();
  }

  public isGuest(): boolean {
    // return this.currentUser ? true : false;
    // return this.currentUser.guest;
    return this.currentUser ? this.currentUser.guest : false;
    // return this.currentUser ? this.currentUser.guest : false;
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
    if (!this.currentUser) { // Todavia no se ha iniciado sesion
      try {
        this.currentUser = await this.local.getItem('user'); // Recuperamos el usuario de local storage
      } catch (error) {
        // this.currentUser = null;
        const uuid = await (await Device.getInfo()).uuid;
        this.currentUser = {
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

  get UID(): string {
    return this.currentUser ? this.currentUser.userId : '';
  }

  get email(): string {
    return this.currentUser ? this.currentUser.email : '';
  }

  get displayName(): string {
    return this.currentUser ? this.currentUser.displayName : '';
  }

  get imageUrl(): string {
    return this.currentUser ? this.currentUser.imageUrl : '';
  }

  showLocalVariableValue() {
    this.local.getItem('user').then((val) => alert(JSON.stringify(val)));
  }

}
