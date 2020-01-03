import { environment } from 'src/environments/environment';
import { AlertService } from './../services/ui/alert.service';
import { CardService } from './../services/card.service';
import { LoadingService } from './../services/ui/loading.service';
import { ToastService } from './../services/ui/toast.service';
import { IconsModalPage } from './../modals/icons-modal/icons-modal.page';
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
    private cardS: CardService,
    private alertS: AlertService,
    private toastS: ToastService,
    private loadingS: LoadingService
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
      this.loadingS.show('Guardando...');


      this.cardS.createCollection()
      .then((ok) => {
        console.log('creacion ok:');
        console.log(ok.id); // Obtengo el id del documento guardado
        this.cardS.addArray(ok.id, this.cardList)
          .then((data) => {
            console.log('guardado ok:');
            this.toastS.showOnceToast('Nota guardada - '+data);
          })
          .catch((err) => {
            this.toastS.showOnceToast('Error al guardar las tarjetas');
          })
          .finally(() => {
            this.loadingS.close();
          });
      })
      .catch((err) => {
        this.toastS.showOnceToast('Error al guardar'); // TODO
        console.log(err);
      });
    }
  }

}
