import { student } from './../model/student';
import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  myCollection: AngularFirestoreCollection;

  constructor(private fireStore: AngularFirestore) {
    this.myCollection = this.fireStore.collection<any>(environment.collection.student);
  }

  readStudents(): Observable<firebase.firestore.QuerySnapshot> {
    return this.myCollection.get();
  }

  addStudent(myStudent: student): Promise<firebase.firestore.DocumentReference> {
    return this.myCollection.add(myStudent);
  }

  readStudentByID(id: string): Observable<firebase.firestore.DocumentSnapshot> {
    return this.myCollection.doc(id).get();
  }

  readStudentsForTeacher(teacherID: string): Observable<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
    return this.fireStore.collection(environment.collection.student, ref => ref.where('teacherId', '==', teacherID)).get();
  }

  assignTeacher(studentId: string, teachId: string) {
    return this.myCollection.doc(studentId).update({
      teacherId: teachId
    });
  }

  // Se podria haber hecho mejor creando un campo id opcional en el tipo note
  updateStudent(id: string, data: student): Promise<void> {
    return this.myCollection.doc(id).set(data);
  }

  deleteStudent(id: string): Promise<void> {
    return this.myCollection.doc(id).delete();
  }

  // Creando un observable
  readStudentsObsv(timer: number = 10000): Observable<student[]> {
    return new Observable((observer) => {
      // observer.next // Devolver valor
      // observer.error() // Devolver error
      // observer.complete() // Cortar ejecucion
      let subscription: Subscription;
      let tempo = setTimeout(() => {
        subscription.unsubscribe();
        observer.error("Timeout"); // Lo que le pasamos al catch
      }, timer);
      subscription = this.readStudents().subscribe((lista) => {
        clearTimeout(tempo);
        let listado = [];
        lista.docs.forEach((student) => {
          listado.push({ id: student.id, ...student.data() }); // Uso del spread operator - junta 2 objetos
        });
        observer.next(listado);
        observer.complete();
      });
    });
  }

  readStudentsObsvForTeacher(teacherID: string, timer: number = 10000): Observable<student[]> {
    return new Observable((observer) => {
      let subscription: Subscription;
      const tempo = setTimeout(() => {
        subscription.unsubscribe();
        observer.error('Timeout'); // Lo que le pasamos al catch
      }, timer);

      subscription = this.readStudentsForTeacher(teacherID).subscribe((lista) => {
        clearTimeout(tempo);
        const listado = [];
        lista.docs.forEach((student) => {
          listado.push({ id: student.id, ...student.data() }); // Uso del spread operator - junta 2 objetos
        });
        observer.next(listado);
        observer.complete();
      });
    });
  }

}
