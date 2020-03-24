import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPageRoutingModule } from './show-routing.module';

import { ShowPage } from './show.page';
import { CanDeactivateGuard } from './can-deactivate.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPageRoutingModule
  ],
  declarations: [ShowPage],
  providers: [CanDeactivateGuard]
})
export class ShowPageModule {}
