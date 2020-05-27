import { CustomLoadingModule } from './../custom-modules/custom-loading/custom-loading.module';
import { DefaultAlertModule } from './../custom-modules/default-alert/default-alert.module';
import { CustomToastModule } from './../custom-modules/custom-toast/custom-toast.module';
import { CardService } from './../services/card.service';
import { IconsModalPage } from './../modals/icons-modal/icons-modal.page';
import { Card } from '../model/Card';
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
  public cardList: Card[];
  public receivedParams: any;
  public showSpinner: boolean;
  public cardsAvailable: boolean;
  public totalTime: number;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private cardS: CardService,
    private alertD: DefaultAlertModule,
    private loadingC: CustomLoadingModule,
    private router: Router,
    private toastC: CustomToastModule
  ) {
    this.cardsChecker = [];
    this.cardList = [];
    this.showSpinner = false;
    this.cardsAvailable = false;
    this.totalTime = 0;
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
  // Para pillar el evento de cuando se cambia la hora, no usado
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
    let newCard: Card = {
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
    this.getTotalTimeRaw();
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
      component: ColorsModalPage,
      animated: true,
      swipeToClose: true,
      mode: 'ios',
      cssClass: 'roundedModal'
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      if (dataReturned.data) {
        this.cardList[cardIndex].color = dataReturned.data;
        console.log('Color received: ' + dataReturned.data);
      }
    });

    return await modal.present()
      .then(() => {
        // triggered when opening the modal
      });
  }

  //=============================================================================
  // Para abrir el modal de pictogramas
  //=============================================================================
  async openIconsModalWithData(cardIndex: number) {
    const modal = await this.modalController.create({
      component: IconsModalPage,
      animated: true,
      swipeToClose: true,
      mode: 'ios',
      cssClass: 'roundedModal'
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      if (dataReturned.data) {
        this.cardList[cardIndex].pictogram = dataReturned.data;
        console.log('Icon received: ' + dataReturned.data);
      }
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
      this.alertD.show('Guardar tarjetas', '', 'Hay tarjetas sin confirmar. Confírmalas o bórralas para continuar');
    }
    else if (this.cardList.length === 0) {
      this.alertD.show('Guardar tarjetas', '', 'No hay tarjetas creadas');
    }
    else {
      this.loadingC.show('');
      this.cardS.editArray(this.receivedParams.get('id'), this.cardList)
        .then((data) => {
          console.log('Tarjetas guardadas');
          this.toastC.show('Tarjetas guardadas');
          // this.router.navigateByUrl('/list');
        })
        .catch((error) => {
          this.toastC.show('Error al guardar las tarjetas');
          console.log(error);
        })
        .finally(() => {
          this.loadingC.hide();
        });
    }
  }

  deleteCard(cardIndex: number) {
    // Elimino 1 elemento a partir del indice dado
    this.cardList.splice(cardIndex, 1);
    this.cardsChecker.splice(cardIndex, 1);
    this.getTotalTimeRaw();
  }

  loadCardsForCurrentUser() {
    console.log('Cargando tarjetas del alumno...');
    this.cardS.readCardsByID(this.receivedParams.get('id'))
      .subscribe((list) => {
        console.log('Tarjetas recibidas');
        if (list.data().data === undefined) { // No hay tarjetas creadas
          this.cardsAvailable = false;
        }
        else { // Cargamos las tarjetas
          this.cardsAvailable = true;
          this.cardList = list.data().data;
          // this.cardList.forEach((element, index) => { // Actualizo el valor de la confimacion de la tarjeta
          //   this.cardsChecker[index] = element.confirmed+'';
          // });
          this.getTotalTimeRaw();
        }
      });
  }

  showSchedule() {
    if (this.cardList.length === 0) {
      this.alertD.show('Reproducir horario', '', 'No hay tarjetas creadas');
    } else {
      console.log('Mostrando horario del alumno...');
      const navigationExtras: NavigationExtras = {
        state: {
          cardsId: this.receivedParams.get('id'),
          cards: this.cardList
        }
      };
      this.router.navigate(['/show'], navigationExtras);
    }
  }

  getTotalTimeRaw() {
    console.log('Getting total time...');
    this.totalTime = 0;
    this.cardList.forEach(e => {
      let onlyTime = e.duration.split('T').pop().split('+')[0]; // Separo las horas hh:mm
      var timeMillis = Number(onlyTime.split(':')[0]) * 60 + Number(onlyTime.split(':')[1]) * 60 * 1000; // Convierto las horas a milisegundos
      console.log('Duration millis: ' + timeMillis);
      this.totalTime += timeMillis;
    });
  }


  // NOTE https://stackoverflow.com/a/35890816/10387022
  getTotalTimeFormatted(ms) {
    return new Date(ms).toISOString().slice(11, -5);
  }

}
