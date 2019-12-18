import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSchedulePage } from './create-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSchedulePageRoutingModule {}
