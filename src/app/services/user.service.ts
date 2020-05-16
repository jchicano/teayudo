import * as firebase from 'firebase/app';
import { StudentService } from './student.service';
import { CardService } from './card.service';
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

  constructor(
    private fireStore: AngularFirestore,
    private cardS: CardService,
    private studentS: StudentService
  ) {
    this.myCollection = this.fireStore.collection<any>(environment.collection.user);
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

  createCredential(email: string, password: string): firebase.auth.AuthCredential {
    const credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    return credentials;
  }

  deleteDBUser(id: string): Promise<void> { // Elimino el documento de firebase de la coleccion user
    return this.myCollection.doc(id).delete();
  }

  deleteUserCascade(id: string, currentPassword: string): Observable<string> {
    // return this.myCollection.doc(id).delete();
    // return this.fireStore.collection(environment.collection.student, ref => ref.where('teacherId', '==', teacherID)).get();
    // return this.fireStore.collection(environment.collection.student, ref => ref.where('teacherId', '==', id)).get(); use este
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
                    // this.cardS.deleteCard(student.data().collectionId) // Elimino el horario del alumno
                    //   .then((e) => {
                    //     this.studentS.deleteStudent(student.id) // TODO usar deleteStudentObs que ahi tambien se borra el schedule? y luego con un if compruebo el string success-deleting noseque y sigo anidando
                    //       .then((e) => {
                    //         this.deleteDBUser(id)
                    //           .then((e) => {
                    //             this.deleteAuthUser()
                    //               .then((e) => {
                    //                 observer.next('success-deleting-user');
                    //                 observer.complete();
                    //               })
                    //               .catch(() => {
                    //                 observer.error('error-deleting-user');
                    //               });
                    //           })
                    //           .catch((e) => {
                    //             console.log(e);
                    //             observer.error('error-deleting-teacher');
                    //           });
                    //       })
                    //       .catch((e) => {
                    //         console.log(e);
                    //         observer.error('error-deleting-student');
                    //       });
                    //   })
                    //   .catch((e) => {
                    //     console.log(e);
                    //     observer.error('error-deleting-schedule');
                    //   });
                    // NUEVO
                    this.studentS.deleteStudentObs(student.id, student.data().collectionId).toPromise()
                      .then((e) => {
                        if (e === 'success-deleting-student') {
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
                        } else {
                          console.log('Error en el observable student');
                        }
                      })
                      .catch((e) => {
                        observer.error(e);
                      });
                    // FIN NUEVO
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
