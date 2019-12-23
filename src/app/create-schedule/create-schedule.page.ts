import { card } from './../model/card';
import { ColorsModalPage } from './../modals/colors-modal/colors-modal.page';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.page.html',
  styleUrls: ['./create-schedule.page.scss'],
})
export class CreateSchedulePage implements OnInit {

  public itemQuantity: number[];
  public cardsChecker: string[];
  public colorForCard: string[];
  public cardList: card[];
  public cardsTitles: string[];

  value = "2019-09-19 1:00:00";

  customPickerOptions = {
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: (e) => {
          // I want to set initial datetime here
          // when the picker is cancelled.
          console.log('cancelled');
          console.log(e);
          this.value = "10:00";
        }
      },
      {
        text: '½ hora',
        handler: ev => {
          console.log(ev);
          this.value = "00:30";
        }
      },
      {
        text: 'OK',
        handler: ev => {
          console.log(ev);
        }
      }
    ]
  };
  
  constructor(
    private modalController: ModalController
  ) {
    this.itemQuantity = [];
    this.cardsChecker = [];
    this.colorForCard = [];
    this.cardList = [];
    this.cardsTitles = [];
  }

  ngOnInit() {
  }

  addCard(): void {
    console.log('Click FAB');
    this.itemQuantity.push(1); // TODO push del tipo tarjeta cuando lo cargue de firebase?
    let newCard: card = {
      title: '',
      pictogram: '',
      color: '',
      duration: '',
      confirmed: false
    };
    this.cardList.push(newCard);
  }

  onValueEmitted(val: string) {
    // do something with 'val'
    console.log(val);
    // console.log('uno: '+val.split('-')[1]);
    console.log('Tengo que poner: '+val.split('-')[0]);
    let index = val.split('-')[1]; // extract after '-' -> id
    let value = val.split('-')[0]; // extract before '-' -> boolean
    this.cardsChecker[index] = val;
    this.cardList[index].confirmed = value;
    console.log('Esta puesto:');
    console.log(this.cardList[0].confirmed);
  }

  async showColorsModal() {
    const modal = await this.modalController.create({
      component: ColorsModalPage
    });
    return await modal.present();
  }

  async openModalWithData(card_index: string) {
    const modal = await this.modalController.create({
      component: ColorsModalPage
    });

    modal.onWillDismiss().then((dataReturned) => {
      // triggered when about to close the modal
      this.colorForCard[card_index] = dataReturned.data;
      this.setCardColor(card_index, dataReturned.data);
      console.log('Color received: ' + dataReturned);
    });

    return await modal.present()
    .then(() => {
      // triggered when opening the modal
    });
  }

//=============================================================================
// comment
//=============================================================================
  saveCards() {
    console.log('Guardando tarjetas');
    this.cardList.forEach(element => {
      console.log(element);
      if(!element.confirmed) {
        
      }
    });
  }

  setCardTitle(index: string) {
    this.cardList[index].title = this.cardsTitles[index];
  }

  setCardColor(index: string, color) {
    this.cardList[index].color = color;
  }

}
