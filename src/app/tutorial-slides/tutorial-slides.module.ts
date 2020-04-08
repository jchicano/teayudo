import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialSlidesPageRoutingModule } from './tutorial-slides-routing.module';

import { TutorialSlidesPage } from './tutorial-slides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialSlidesPageRoutingModule
  ],
  declarations: [TutorialSlidesPage]
})
export class TutorialSlidesPageModule {}
