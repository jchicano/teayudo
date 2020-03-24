import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPage } from './show.page';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ShowPage,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPageRoutingModule {}
