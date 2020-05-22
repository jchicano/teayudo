import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { StudentService } from './student.service';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService { // User is Teacher

  myCollection: AngularFirestoreCollection;

  public emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public passRegex: RegExp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
  public storageRef;

  constructor(
    private fireStore: AngularFirestore,
    private studentS: StudentService,
    private storage: AngularFireStorage
  ) {
    this.myCollection = this.fireStore.collection<any>(environment.collection.user);
    this.storageRef = firebase.storage().ref();
  }

  createUser(id: string, inputName: string): Promise<void> {
    console.log(id);
    console.log(inputName);
    return this.myCollection.doc(id).set({
      uid: id,
      name: inputName,
      avatar: ''
    });
  }

  getUserByID(id: string): Observable<firebase.firestore.DocumentSnapshot> {
    return this.myCollection.doc(id).get();
  }

  updateName(id: string, newName: string): Promise<void> {
    return this.myCollection.doc(id).update({ name: newName });
  }

  updateAvatar(id: string, newImage: string): Promise<void> {
    return this.myCollection.doc(id).update({ avatar: newImage });
  }

  // NOTE https://stackoverflow.com/q/45799684
  uploadImage(uid: string, image: Blob): firebase.storage.UploadTask {
    return this.storageRef.child('avatar/' + uid).put(image);
  }

  // NOTE https://firebase.google.com/docs/storage/web/download-files
  getDownloadURL(filename: string): Promise<any> {
    return this.storageRef.child('avatar/' + filename).getDownloadURL();
  }

  deleteImage(filename: string): Promise<any> {
    return this.storageRef.child('avatar/' + filename).delete();
  }

  createCredential(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    return credentials;
  }

  deleteDBUser(id: string): Promise<void> { // Elimino el documento de firebase de la coleccion user
    return this.myCollection.doc(id).delete();
  }

  deleteUserCascade(id: string, currentPassword: string): Observable<string> {
    return new Observable((observer) => {
      if (this.passRegex.test(currentPassword)) {
        const cpUser = firebase.auth().currentUser;
        const credentials = this.createCredential(cpUser.email, currentPassword);
        // Reauthenticating here with the data above
        cpUser.reauthenticateWithCredential(credentials)
          .then((e) => {
            this.fireStore.collection(environment.collection.student, ref => ref.where('teacherId', '==', id)).get()
              .subscribe((students) => {
                if (students.size !== 0) { // Si el profesor tiene alumnos creados
                  students.forEach((student) => { // Obtengo los alumnos del profesor
                    console.log('student.data():', student.data());
                    this.studentS.deleteStudentObs(student.id, student.data().collectionId).toPromise()
                      .then((e) => {
                        if (e === 'success-deleting-student') {
                          this.deleteDBUser(id)
                            .then((e) => {
                              this.deleteAuthUser()
                                .then((e) => {
                                  this.deleteImage(id)
                                    .then((e) => {
                                      observer.next('success-deleting-user');
                                      observer.complete();
                                    })
                                    .catch((error) => {
                                      observer.error('error-deleting-storage');
                                    })
                                })
                                .catch((error) => {
                                  observer.error('error-deleting-user');
                                });
                            })
                            .catch((e) => {
                              console.log(e);
                              observer.error('error-deleting-teacher');
                            });
                        } else {
                          console.log('Error en el observable student');
                        }
                      })
                      .catch((e) => {
                        observer.error(e);
                      });
                  });
                } else { // El profesor no tiene alumnos
                  this.deleteDBUser(id)
                    .then((e) => {
                      this.deleteAuthUser()
                        .then((e) => {
                          observer.next('success-deleting-user');
                          observer.complete();
                        })
                        .catch(() => {
                          observer.error('error-deleting-user');
                        });
                    })
                    .catch((e) => {
                      console.log(e);
                      observer.error('error-deleting-teacher');
                    });
                }
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
    });
  }

  // NOTE https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user
  deleteAuthUser(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const user = firebase.auth().currentUser;
      user.delete().then((e) => {
        // User deleted.
        resolve(true);
      }).catch((e) => {
        // An error happened.
        console.log(e);
        reject(false);
      });
    });
  }

}
