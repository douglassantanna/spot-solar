import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './proposals/view/view.component';
import { CreateComponent } from './proposals/create/create.component';
import { ViewPdfComponent } from './proposals/view-pdf/view-pdf.component';

const routes: Routes = [
  { path: 'view-proposals', component: ViewComponent },
  { path: 'create-proposal', component: CreateComponent },
  { path: 'view-pdf', component: ViewPdfComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
