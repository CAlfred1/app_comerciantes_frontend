import { Routes } from '@angular/router';
import { PagosComponent } from './pagos/pagos';

export const routes: Routes = [
  { path: '', redirectTo: 'pagos', pathMatch: 'full' },
  { path: 'pagos', component: PagosComponent }
];
