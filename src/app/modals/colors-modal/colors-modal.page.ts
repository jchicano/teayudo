import { ColorService } from './../../services/color.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-colors-modal',
  templateUrl: './colors-modal.page.html',
  styleUrls: ['./colors-modal.page.scss'],
})
export class ColorsModalPage implements OnInit {

  public selectedColor: string;
  public colorList: any[];

  constructor(
    private modalController: ModalController,
    public colorS: ColorService
  ) {
    this.selectedColor = '';
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss(this.selectedColor);
  }

  radioChecked(color) {
    this.selectedColor = color;
    console.log('Color seleccionado: ' + color);
  }

}
