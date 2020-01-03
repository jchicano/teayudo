import { IconsModalPage } from './../modals/icons-modal/icons-modal.page';
import { AlertService } from './../services/alert.service';
import { card } from './../model/card';
import { ColorsModalPage } from './../modals/colors-modal/colors-modal.page';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.page.html',
  styleUrls: ['./create-schedule.page.scss'],
})
export class CreateSchedulePage implements OnInit {

  public scheduleTitle: string;
  public cardsChecker: string[];
  public cardList: card[];

  constructor(
    private modalController: ModalController,
    private alertS: AlertService
  ) {
    this.scheduleTitle = '';
    this.cardsChecker = [];
    this.cardList = [];
  }

  ngOnInit() {
  }

  //=============================================================================
  // Funcion que se llama cuando se hace click en el boton flotante
  //=============================================================================
  addCard(): void {
    console.log('Click FAB');
    let newCard: card = {
      title: '',
      pictogram: '',
      color: '',
      duration: new Date('2020-01-01 1:00:00').toISOString(),
      confirmed: false
    };
    this.cardList.push(newCard);
  }

  //=============================================================================
  // Funcion que recoje el valor que manda el componente confirm-checkbox
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
  async openColorsModalWithData(card_index: string) {
    const modal = await this.modalController.create({
      component: ColorsModalPage
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      this.cardList[card_index].color = dataReturned.data;
      console.log('Color received: ' + dataReturned);
    });

    return await modal.present()
      .then(() => {
        // triggered when opening the modal
      });
  }

  //=============================================================================
  // Para abrir el modal de colores
  //=============================================================================
  async openIconsModalWithData(card_index: string) {
    const modal = await this.modalController.create({
      component: IconsModalPage
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      this.cardList[card_index].pictogram = dataReturned.data;
      console.log('Icon received: ' + dataReturned);
      console.log('Revisar aqui TODO2');
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
    this.cardList.forEach(element => {
      console.log(element);
      alert(element.duration);
      if (!element.confirmed) {
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
      // TODO guardar en firebase! :)
    }
  }

}
