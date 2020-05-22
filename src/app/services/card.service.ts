import { Card } from '../model/Card';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  myCollection: AngularFirestoreCollection;

  constructor(private fireStore: AngularFirestore) {
    this.myCollection = fireStore.collection<any>(environment.collection.card);
  }

  readCardSimple(): Observable<firebase.firestore.QuerySnapshot> {
    return this.myCollection.get();
  }

  // Creando un observable
  readCard(timer: number = 10000,): Observable<Card[]> { //NOTE antiguo readTODO2
    return new Observable((observer) => {
      // observer.next // Devolver valor
      // observer.error() // Devolver error
      // observer.complete() // Cortar ejecucion
      let subscription: Subscription;
      let tempo = setTimeout(() => {
        subscription.unsubscribe();
        observer.error("Timeout"); // Lo que le pasamos al catch
      }, timer);
      subscription = this.readCardSimple().subscribe((lista) => {
        clearTimeout(tempo);
        let listado = [];
        lista.docs.forEach((card) => {
          listado.push({ id: card.id, ...card.data() }); // Uso del spread operator - junta 2 objetos
        });
        observer.next(listado);
        observer.complete();
      });
    });
  }

  createCollection(): Promise<firebase.firestore.DocumentReference> {
    return this.myCollection.add({});
  }

  editArray(docId: string, data: Card[]): Promise<void> {
    return this.myCollection.doc(docId).set({data}); // Aunque le pase el array hay que encapsularlo en un objeto
  }

  addArray(data: Card[]): Promise<firebase.firestore.DocumentReference> {
    return this.myCollection.add({data}); // Aunque le pase el array hay que encapsularlo en un objeto
  }

  addCard(myCard: Card): Promise<firebase.firestore.DocumentReference> {
    return this.myCollection.add(myCard);
  }

  readCardsByID(id: string): Observable<firebase.firestore.DocumentSnapshot> {
    return this.myCollection.doc(id).get();
  }

  // Se podria haber hecho mejor creando un campo id opcional en el tipo note
  updateCard(id: string, data: Card): Promise<void> {
    return this.myCollection.doc(id).set(data); // TODO usar data.id y cuando devolvamos desde firebase los objetos les metemos el id
  }

  deleteCard(id: string): Promise<void> {
    return this.myCollection.doc(id).delete();
  }

}
