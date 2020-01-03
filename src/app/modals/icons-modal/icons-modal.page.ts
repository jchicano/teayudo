import { IconService } from './../../services/icon.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-icons-modal',
  templateUrl: './icons-modal.page.html',
  styleUrls: ['./icons-modal.page.scss'],
})
export class IconsModalPage implements OnInit {

  public selectedIcon: string;
  public iconList: any[];

  constructor(
    private modalController: ModalController,
    public iconS: IconService
  ) {
    this.selectedIcon = '';
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss(this.selectedIcon);
  }

  radioChecked(icon) {
    this.selectedIcon = icon;
    console.log('Icono seleccionado: ' + icon);
  }

}
