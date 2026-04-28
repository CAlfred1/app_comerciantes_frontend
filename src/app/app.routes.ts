import { Routes } from '@angular/router';
import { ComprobantesComponent } from './comprobantes/comprobantes';
import { PagosComponent } from './pagos/pagos';
import { PagosRegistroComponent } from './pagos-registro/pagos-registro';
import { SociosComponent } from './socios/socios';
import { PuestosComponent } from './puestos/puestos';
import { DeudasComponent } from './deudas/deudas';

export const routes: Routes = [
  { path: '', redirectTo: 'socios', pathMatch: 'full' },
  { path: 'socios', component: SociosComponent },
  { path: 'puestos', component: PuestosComponent },
  { path: 'deudas', component: DeudasComponent },
  { path: 'comprobantes', component: ComprobantesComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'pagos/registrar', component: PagosRegistroComponent },
];
