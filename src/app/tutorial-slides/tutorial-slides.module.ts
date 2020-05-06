import { LoginModalPage } from './../modals/login-modal/login-modal.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialSlidesPageRoutingModule } from './tutorial-slides-routing.module';

import { TutorialSlidesPage } from './tutorial-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialSlidesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TutorialSlidesPage, LoginModalPage],
  entryComponents: [LoginModalPage]
})
export class TutorialSlidesPageModule {}
