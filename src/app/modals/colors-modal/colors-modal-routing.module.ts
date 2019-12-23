import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorsModalPage } from './colors-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ColorsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorsModalPageRoutingModule {}
