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

  radioChecked($event) {
    const indexSelected = $event.detail.value.slice(-1);
    console.log('Seleccionado radio con index:', indexSelected);
    this.selectedIcon = this.iconS.iconList[indexSelected].url;
    console.log('Icono seleccionado:', this.selectedIcon);
  }

}
