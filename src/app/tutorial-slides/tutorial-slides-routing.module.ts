import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialSlidesPage } from './tutorial-slides.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialSlidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialSlidesPageRoutingModule {}
