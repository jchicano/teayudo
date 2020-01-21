import { AlertService } from './../../services/ui/alert.service';
import { ToastService } from './../../services/ui/toast.service';
import { CardService } from './../../services/card.service';
import { student } from './../../model/student';
import { StudentService } from './../../services/student.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-student-modal',
  templateUrl: './student-modal.page.html',
  styleUrls: ['./student-modal.page.scss'],
})
export class StudentModalPage implements OnInit {

  studentForm: FormGroup;
  formError: string = '';
  studentObject: any; // Recibo parametro opcional que se le pasa al modal

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private studentS: StudentService,
    private cardS: CardService,
    private toastS: ToastService,
    private alertS: AlertService
  ) {
  }

  ngOnInit() {
    this.studentForm = this.fb.group({
      nombre: ['', Validators.required]
    });
    if (this.studentObject !== undefined) {
      this.studentForm.get('nombre').setValue(this.studentObject.fullname);
    }
    console.log('Parametro recibido por el modal:');
    console.log(this.studentObject);
  }

  resetFormFields() {
    this.studentForm.reset();
    this.formError = '';
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  createStudent() {
    console.log('Guardando alumno...');
    if (this.studentObject !== undefined) { // Estamos editando un usuario
      console.log('Se va a editar un alumno');
      let updatedStudent: student = {
        fullname: this.studentForm.get('nombre').value,
        collectionId: this.studentObject.collectionId
      }
      this.studentS.updateStudent(this.studentObject.id, updatedStudent)
        .then(() => {
          this.toastS.showOnceToast('Alumno editado correctamente');
          this.closeModal();
        })
        .catch((error) => {
          this.toastS.showOnceToast('Error al editar alumno');
          console.log(error);
        });
    }
    else { // Estamos creando un usuario
      console.log('Se va a crear un alumno');
      if (this.studentForm.valid) {
        this.cardS.createCollection()
          .then((ok) => {
            console.log('Coleccion creada con exito: ' + ok.id); // Obtengo el id del documento guardado
            let myStudent: student = {
              fullname: this.studentForm.get('nombre').value,
              collectionId: ok.id
            };
            this.studentS.addStudent(myStudent)
              .then(() => {
                this.toastS.showOnceToast('Alumno creado correctamente');
                console.log(myStudent);
                this.closeModal();
              })
              .catch((error) => {
                this.toastS.showOnceToast('Error al crear alumno');
                console.log(error);
              })
          })
          .catch((err) => {
            this.toastS.showOnceToast('Error al guardar alumno');
            console.log(err);
          });
      }
      else {
        this.alertS.presentAlert('Guardar alumno', '', 'Rellena correctamente el campo');
      }
    }
  }

}
