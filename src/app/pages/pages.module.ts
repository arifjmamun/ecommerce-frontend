import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { pagesRoutes } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { CartsModule } from './orders/carts/carts.module';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(pagesRoutes),
    CartsModule,
    LayoutModule,
    SharedModule
  ],
  declarations: []
})
export class PagesModule { }
