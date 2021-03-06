import { AuthService } from './../services/auth.service';
import { CustomToastModule } from './../custom-modules/custom-toast/custom-toast.module';
import { CustomLoadingModule } from './../custom-modules/custom-loading/custom-loading.module';
import { Subscription } from 'rxjs';
import { StudentModalPage } from './../modals/student-modal/student-modal.page';
import { StudentService } from './../services/student.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonList, ModalController, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  @ViewChild('list', { static: false }) list: IonList;

  public studentList: any[];
  public showSpinner: boolean;
  public studentsAvailable: boolean;
  private subscription: Subscription;
  public searchText: string;

  constructor(
    private studentS: StudentService,
    private modalController: ModalController,
    private toastC: CustomToastModule,
    private navCtrl: NavController,
    private platform: Platform,
    private loadingC: CustomLoadingModule,
    private auth: AuthService
  ) {
    this.showSpinner = false; // Se usaba para mostrar el componente spinner
    this.studentsAvailable = false;
    this.searchText = '';
  }

  ngOnInit() { }

  // NOTE https://stackoverflow.com/a/58736680
  // Para que funcione el boton atras al salir de la app
  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      this.navCtrl.navigateBack('/home');
    });
    this.refresh();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  // Refresco de la lista
  async refresh($event?) {
    if (!$event) {
      this.showSpinner = true; // Si se usa el ion-refresher no se muestra spinner central
    }
    this.loadingC.show("");
    //this.studentList = [];
    console.log("Cargando alumnos");
    try {
      this.studentS.readStudentsObsvForTeacher(this.auth.user.userId).subscribe((list) => { // Si esta logueado pasamos el UID, si es invitado pasamos el UID del dispositivo
        if (list.length <= 0) this.studentsAvailable = false;
        else this.studentsAvailable = true;
        this.studentList = list;
        this.showSpinner = false;
        this.loadingC.hide();
        if ($event) $event.target.complete();
        console.log('Alumnos cargados');
        // console.log(this.studentList);
      });
    } catch (error) {
      this.showSpinner = false;
      this.loadingC.hide();
      this.toastC.show('Error al cargar alumnos');
      console.log(error);
    }
    console.log('Peticion de carga solicitada');
  }

  editStudent(currentStudent: any) {
    console.log('editStudent');
    this.list.closeSlidingItems();
    console.log('obj:');
    console.log(currentStudent);
    this.openUserModal(currentStudent);
  }

  deleteStudent(currentStudent: any) {
    console.log('deleteStudent');
    this.list.closeSlidingItems();
    this.studentS.deleteStudentObs(currentStudent.id, currentStudent.collectionId)
      .subscribe((e) => {
        switch (e) {
          case 'error-deleting-schedule':
            this.toastC.show('Error al eliminar el horario del alumno');
            console.log('Error al eliminar el horario del alumno');
            break;
          case 'error-deleting-student':
            this.toastC.show('Error al eliminar el alumno');
            console.log('Error al eliminar el alumno');
            break;
          case 'success-deleting-student':
            this.toastC.show('Alumno eliminado con éxito');
            console.log('Alumno eliminado correctamente');
            this.refresh();
            break;
          default: break;
        }
      });
  }

  addStudent() {
    console.log('Click FAB addStudent');
    this.openUserModal();
  }

  async openUserModal(currentStudent?: any) {
    let modal: any;
    if (currentStudent) { // Se actualiza alumno, se pasan parametros
      modal = await this.modalController.create({
        component: StudentModalPage,
        componentProps: {
          studentObject: currentStudent
        },
        animated: true,
        swipeToClose: true,
        mode: 'ios',
        cssClass: 'roundedModal'
      });
    } else { // Se crea alumno, no se pasan parametros
      modal = await this.modalController.create({
        component: StudentModalPage,
        animated: true,
        swipeToClose: true,
        mode: 'ios',
        cssClass: 'roundedModal'
      });
    }
    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      //console.log('Data received: ' + dataReturned);
      this.refresh();
    });
    return await modal.present()
      .then(() => {
        // triggered when opening the modal
      });
  }

  search($event) {
    // console.log($event);
    this.searchText = $event.detail.value;
  }

}
