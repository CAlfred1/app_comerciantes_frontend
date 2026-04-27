import { Routes } from '@angular/router';
import { PagosComponent } from './pagos/pagos';
import { SociosComponent } from './socios/socios';
import { PuestosComponent } from './puestos/puestos';

export const routes: Routes = [
  { path: '', redirectTo: 'socios', pathMatch: 'full' },
  { path: 'socios', component: SociosComponent },
  { path: 'puestos', component: PuestosComponent },
  { path: 'pagos', component: PagosComponent },
];
