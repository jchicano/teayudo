import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IconsModalPage } from './icons-modal.page';

const routes: Routes = [
  {
    path: '',
    component: IconsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconsModalPageRoutingModule {}
