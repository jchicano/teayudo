import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StudentModalPageRoutingModule } from './student-modal-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentModalPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class StudentModalPageModule {}
