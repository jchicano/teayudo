import { UserService } from './user.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from '../model/User';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected currentUser: User;

  constructor(
    private local: NativeStorage,
    // private google: GooglePlus,
    private router: Router,
    private db: AngularFirestore,
    private userS: UserService,
    private AFauth: AngularFireAuth
  ) { }

  // public isAuthenticated(): boolean {
  //   return this.user ? true : false;
  // }



  // public async checkSession(): Promise<void> {
  //   if (!this.user) { // Todavia no se ha iniciado sesion
  //     try {
  //       this.user = await this.local.getItem('user'); // Recuperamos el usuario de local storage
  //     } catch (error) {
  //       this.user = null;
  //     }
  //   }
  // }

  // public loginGoogle(): Promise<boolean> {
  //   console.log("En el servicio");
  //   return new Promise((resolve, reject) => {
  //     // Logica
  //     this.google.login({}) // Config basica
  //       .then((d) => {
  //         console.log(d);
  //         if (d && d.email) {
  //           let user: User = {
  //             email: d.email,
  //             displayName: d.displayName,
  //             imageUrl: d.imageUrl,
  //             userId: d.userId
  //           }
  //           this.user = user;
  //           this.saveSession(user);
  //           resolve(true);
  //           // Ya esta guardado
  //         }
  //         else resolve(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         resolve(false);
  //       });
  //   });
  // }

  // public async logout() {
  //   await this.google.logout();
  //   this.user = null;
  //   await this.saveSession();
  //   this.router.navigate(['login']);
  // }

  register(userdata): Promise<boolean> {
    // firebase.auth().createUserWithEmailAndPassword(userdata.email, userdata.password)
    //   .catch(error => {
    //     console.log(error);
    //   });

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
              imageUrl: 'assets/img/avatar.svg',
              userId: d.user.uid
            };
            this.currentUser = user;
            this.saveSession(user);
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
    // firebase.auth().signInWithEmailAndPassword(userdata.email, userdata.password)
    //   .then(response => {
    //     console.log(response);
    //     this.router.navigate(['/home']);
    //   }).catch(
    //     error => { console.log(error); }
    //   );

    return new Promise((resolve, reject) => {
      this.AFauth.auth.signInWithEmailAndPassword(userdata.email, userdata.password)
        .then((d) => {
          // console.log(d);
          if (d && d.user) {
            let name = null;
            this.userS.getUserByID(d.user.uid)
              .subscribe((r) => {
                name = r.data;
              });
            let user: User = {
              email: d.user.email,
              displayName: name,
              imageUrl: 'assets/img/avatar.svg',
              userId: d.user.uid
            };
            this.currentUser = user;
            this.saveSession(user);
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

  isAuthenticated() {
    const user = this.AFauth.auth.currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
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

}
