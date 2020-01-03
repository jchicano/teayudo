import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IconsModalPageRoutingModule } from './icons-modal-routing.module';

import { IconsModalPage } from './icons-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IconsModalPageRoutingModule
  ],
  declarations: [IconsModalPage]
})
export class IconsModalPageModule {}
