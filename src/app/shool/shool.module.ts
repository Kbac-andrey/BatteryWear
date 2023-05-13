import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceListComponent } from './device-list/device-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SchoolListComponent } from './school-list/school-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [SchoolListComponent, DeviceListComponent],
  exports: [SchoolListComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MatExpansionModule,
    MatTableModule
  ]
})
export class ShoolModule { }
