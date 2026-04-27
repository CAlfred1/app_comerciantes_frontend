import { Routes } from '@angular/router';
import { PagosComponent } from './pagos/pagos';
import { SociosComponent } from './socios/socios';
import { PuestosComponent } from './puestos/puestos';
import { DeudasComponent } from './deudas/deudas';

export const routes: Routes = [
  { path: '', redirectTo: 'socios', pathMatch: 'full' },
  { path: 'socios', component: SociosComponent },
  { path: 'puestos', component: PuestosComponent },
  { path: 'deudas', component: DeudasComponent },
  { path: 'pagos', component: PagosComponent },
];
