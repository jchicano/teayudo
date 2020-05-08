import { Observable } from 'rxjs';
import { environment } from './../../environments/environment.prod';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService { // User is Teacher

  myCollection: AngularFirestoreCollection;

  constructor(
    private fireStore: AngularFirestore
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

}
