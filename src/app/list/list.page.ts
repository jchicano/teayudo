import { CustomToastModule } from './../custom-modules/custom-toast/custom-toast.module';
import { CustomLoadingModule } from './../custom-modules/custom-loading/custom-loading.module';
import { Subscription } from 'rxjs';
import { CardService } from './../services/card.service';
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
  public studentListBackup: any[];
  public showSpinner: boolean;
  public studentsAvailable: boolean;
  public filterSelected: boolean;
  private subscription: Subscription;

  constructor(
    private studentS: StudentService,
    private cardS: CardService,
    private modalController: ModalController,
    private toastC: CustomToastModule,
    private navCtrl: NavController,
    private platform: Platform,
    private loadingC: CustomLoadingModule
  ) {
    this.showSpinner = false; // Se usaba para mostrar el componente spinner
    this.studentsAvailable = false;
    this.filterSelected = false;
  }

  ngOnInit() {
    this.refresh();
  }

  // NOTE https://stackoverflow.com/a/58736680
  // Para que funcione el boton atras al salir de la app
  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(1, () => {
      this.navCtrl.navigateBack('/home');
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  // Refresco de la lista
  async refresh($event?) {
    if (!$event){
      this.showSpinner = true; // Si se usa el ion-refresher no se muestra spinner central
    }
    this.loadingC.show("");
    //this.studentList = [];
    console.log("Cargando alumnos");
    try {
      this.studentS.readStudentsObsv().subscribe((list) => {
        if (list.length <= 0) this.studentsAvailable = false;
        else this.studentsAvailable = true;
        this.studentList = list;
        this.studentListBackup = this.studentList.slice(0); // Clono el array para poder restablecer el filtro
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
    this.cardS.deleteCard(currentStudent.collectionId)
      .then(() => {
        console.log('Horario del alumno eliminado')
      })
      .catch((error) => {
        console.log(error);
      });
    this.studentS.deleteStudent(currentStudent.id)
      .then(() => {
        console.log('Alumno eliminado')
        this.toastC.show('Alumno eliminado');
        this.refresh();
      })
      .catch((error) => {
        console.log(error);
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
        }
      });
    }
    else { // Se crea alumno, no se pasan parametros
      modal = await this.modalController.create({
        component: StudentModalPage
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

  orderList() {
    console.log('Aplicando filtro');
    if (this.filterSelected) { // Ya estaba pulsado el filtro
      // this.refresh();
      this.studentList = this.studentListBackup;
    }
    else { // No estaba pulsado el filtro
      // NOTE https://stackoverflow.com/a/35092754/10387022
      this.studentList.sort((a, b) => a.fullname.localeCompare(b.fullname));
    }
    this.filterSelected = !this.filterSelected;
  }

}
