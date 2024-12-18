import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { cusComponent } from './cus.component';
const routes: Routes = [{
  path: '',
  component: cusComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
