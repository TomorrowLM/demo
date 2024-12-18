import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { cusComponent } from './cus.component';
import { ComAComponent } from './com-a/com-a.component';
import { FormsModule } from '@angular/forms'; // 导入 FormsModule

@NgModule({
  declarations: [cusComponent, ComAComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule
  ]
})
export class CustomersModule { }
