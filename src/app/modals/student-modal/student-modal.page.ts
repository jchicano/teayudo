import { Plugins } from '@capacitor/core';
import { CustomLoadingModule } from './../../custom-modules/custom-loading/custom-loading.module';
import { AuthService } from './../../services/auth.service';
import { DefaultAlertModule } from './../../custom-modules/default-alert/default-alert.module';
import { CustomToastModule } from './../../custom-modules/custom-toast/custom-toast.module';
import { CardService } from './../../services/card.service';
import { Student } from '../../model/Student';
import { StudentService } from './../../services/student.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

const { Device } = Plugins;

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
    private toastC: CustomToastModule,
    private alertD: DefaultAlertModule,
    private auth: AuthService,
    private loadingC: CustomLoadingModule
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
      let updatedStudent: Student = {
        fullname: this.studentForm.get('nombre').value,
        collectionId: this.studentObject.collectionId
      }
      this.studentS.updateStudent(this.studentObject.id, updatedStudent)
        .then(() => {
          this.toastC.show('Alumno editado correctamente');
          this.closeModal();
        })
        .catch((error) => {
          this.toastC.show('Error al editar alumno');
          console.log(error);
        });
    }
    else { // Estamos creando un usuario
      console.log('Se va a crear un alumno');
      this.loadingC.show('');
      if (this.studentForm.valid) {
        this.cardS.createCollection()
          .then((ok) => {
            // console.log('Coleccion creada con exito: ' + ok.id); // Obtengo el id del documento guardado
            const myStudent: Student = {
              fullname: this.studentForm.get('nombre').value,
              collectionId: ok.id
            };
            this.studentS.addStudent(myStudent)
              .then(async (r) => {
                // console.log('Alumno creado con exito: ' + r.id);
                // console.log(myStudent);
                this.studentS.assignTeacher(r.id, this.auth.user.userId)
                  .then((r) => {
                    this.toastC.show('Alumno creado correctamente');
                  })
                  .catch((r) => {
                    this.toastC.show('Error al asignar alumno');
                    console.log(r);
                  })
                  .finally(() => {
                    this.loadingC.hide();
                    this.closeModal();
                  });
              })
              .catch((error) => {
                this.toastC.show('Error al crear alumno');
                console.log(error);
              });
          })
          .catch((err) => {
            this.toastC.show('Error al guardar alumno');
            console.log(err);
          });
      }
      else {
        this.alertD.show('Guardar alumno', '', 'Rellena correctamente el campo');
      }
    }
  }

}
