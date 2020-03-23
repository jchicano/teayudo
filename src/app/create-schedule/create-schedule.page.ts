import { LoadingService } from './../services/ui/loading.service';
import { AlertService } from './../services/ui/alert.service';
import { CardService } from './../services/card.service';
import { ToastService } from './../services/ui/toast.service';
import { IconsModalPage } from './../modals/icons-modal/icons-modal.page';
import { card } from './../model/card';
import { ColorsModalPage } from './../modals/colors-modal/colors-modal.page';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.page.html',
  styleUrls: ['./create-schedule.page.scss'],
})
export class CreateSchedulePage implements OnInit {

  public cardsChecker: string[];
  public cardList: card[];
  public receivedParams: any;
  public showSpinner: boolean;
  public cardsAvailable: boolean;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private cardS: CardService,
    private alertS: AlertService,
    private toastS: ToastService,
    private loadingS: LoadingService,
    private router: Router
  ) {
    this.cardsChecker = [];
    this.cardList = [];
    this.showSpinner = false;
    this.cardsAvailable = false;
  }

  ngOnInit() {
    // NOTE https://stackoverflow.com/a/57737992/10387022
    //=============================================================================
    // Recibo los parametros del alumno al que le crearemos el horario
    //=============================================================================
    this.route.paramMap
      .subscribe((params) => {
        console.log('Parametros de alumno recibidos');
        // console.log(params);
        this.receivedParams = params;
        this.loadCardsForCurrentUser();
      });
  }

  // NOTE https://forum.ionicframework.com/t/ion-datetime-binding-through-ngmodel-ionic-v4/137187/7
  // Para pillar el evento de cuando se cambia la hora
  updateMyDate(index, $event) {
    console.log($event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
    this.cardList[index].duration = $event;
  }

  //=============================================================================
  // Funcion que se llama cuando se hace click en el boton flotante
  //=============================================================================
  addCard(): void {
    console.log('Click FAB addCard');
    this.cardsAvailable = true;
    let newCard: card = {
      title: '',
      pictogram: '',
      color: '',
      //duration: new Date('2020-01-01 1:00:00').toISOString(),
      duration: "1994-12-15T00:00",
      // duration: new Date('2020-01-01T00:01:00+01:00').toISOString(),
      //duration: "2020-01-01T01:00:00.000Z",
      confirmed: false,
      completed: false
    };
    this.cardList.push(newCard);
  }

  //=============================================================================
  // Funcion que recoge el valor que manda el componente confirm-checkbox
  //=============================================================================
  onValueEmitted(val: string) {
    // do something with 'val'
    let index = val.split('-')[1]; // extract after '-' -> id
    let value = val.split('-')[0]; // extract before '-' -> boolean
    // Tengo que usar este array porque accediendo al array de objetos cardList desde la vista no funciona bien
    this.cardsChecker[index] = val;
    this.cardList[index].confirmed = value;
  }

  //=============================================================================
  // Para abrir el modal de colores
  //=============================================================================
  async openColorsModalWithData(cardIndex: number) {
    const modal = await this.modalController.create({
      component: ColorsModalPage
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      this.cardList[cardIndex].color = dataReturned.data;
      console.log('Color received: ' + dataReturned.data);
    });

    return await modal.present()
      .then(() => {
        // triggered when opening the modal
      });
  }

  //=============================================================================
  // Para abrir el modal de colores
  //=============================================================================
  async openIconsModalWithData(cardIndex: number) {
    const modal = await this.modalController.create({
      component: IconsModalPage
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      this.cardList[cardIndex].pictogram = dataReturned.data;
      console.log('Icon received: ' + dataReturned.data);
    });

    return await modal.present()
      .then(() => {
        // triggered when opening the modal
      });
  }

  //=============================================================================
  // Funcion que se llama desde el boton de guardar horario
  //=============================================================================
  saveCards() {
    console.log('Guardando tarjetas');
    let cardsWithoutConfirmation: boolean = false;
    this.cardList.forEach((element, index) => {
      console.log(element);
      if (!element.confirmed || !this.cardsChecker[index]) {
        cardsWithoutConfirmation = true;
      }
    });
    if (cardsWithoutConfirmation) {
      this.alertS.presentAlert('Guardar tarjetas', '', 'Hay tarjetas sin confirmar. Confírmalas o bórralas para continuar');
    }
    else if (this.cardList.length === 0) {
      this.alertS.presentAlert('Guardar tarjetas', '', 'No hay tarjetas creadas');
    }
    else {
      this.loadingS.show('Guardando');
      this.cardS.editArray(this.receivedParams.get('id'), this.cardList)
        .then((data) => {
          console.log('Tarjetas guardadas');
          this.toastS.showOnceToast('Tarjetas guardadas');
          // this.router.navigateByUrl('/list');
        })
        .catch((error) => {
          this.toastS.showOnceToast('Error al guardar las tarjetas');
          console.log(error);
        })
        .finally(() => {
          this.loadingS.close();
        });
    }
  }

  deleteCard(cardIndex: number) {
    // Elimino 1 elemento a partir del indice dado
    this.cardList.splice(cardIndex, 1);
    this.cardsChecker.splice(cardIndex, 1);
  }

  loadCardsForCurrentUser() {
    console.log('Cargando tarjetas del alumno...');
    this.cardS.readCardsByID(this.receivedParams.get('id'))
    .subscribe((list) => {
      console.log('Tarjetas recibidas');
      if(list.data().data === undefined) { // No hay tarjetas creadas
        this.cardsAvailable = false;
      }
      else{ // Cargamos las tarjetas
        this.cardsAvailable = true;
        this.cardList = list.data().data;
        // this.cardList.forEach((element, index) => { // Actualizo el valor de la confimacion de la tarjeta
        //   this.cardsChecker[index] = element.confirmed+'';
        // });
      }
    });
  }

  showSchedule() {
    console.log('Mostrando horario del alumno...');
    let navigationExtras: NavigationExtras = {
      state: {
        cardsId: this.receivedParams.get('id'),
        cards: this.cardList
      }
    };
    this.router.navigate(['/show'], navigationExtras);
  }

}
