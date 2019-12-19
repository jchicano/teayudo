import { ComponentsModule } from './../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateSchedulePageRoutingModule } from './create-schedule-routing.module';
import { CreateSchedulePage } from './create-schedule.page';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateSchedulePageRoutingModule,
    ComponentsModule,
    ColorPickerModule
  ],
  declarations: [CreateSchedulePage]
})
export class CreateSchedulePageModule {}
