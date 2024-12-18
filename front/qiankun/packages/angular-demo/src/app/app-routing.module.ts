import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersModule } from './customers/customers.module';
import { AppComponent } from './app.component';
// const routes: Routes = [];
const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'CustomersModule' }, //重定向
  {
    path: '', //默认AppComponent
    // component: AppComponent,
    children: [
      { path: 'CustomersModule', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
