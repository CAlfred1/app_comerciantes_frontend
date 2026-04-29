import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LayoutComponent } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      // Usuarios
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/pages/list/list')
            .then(m => m.ListComponent)
      },
      // Socios
      {
        path:'socios',
        loadComponent: () =>
        import('./features/socios/pages/list/list')
        .then(m => m.ListComponent)
      },
      // Puesto
      {
        path:'puestos',
        loadComponent: () =>
        import('./features/puestos/pages/list/list')
        .then(m => m.ListComponent)
      },

      // Motivos de Cobro
      {
        path: 'motivos-cobro/nuevo',
        loadComponent: () =>
          import('./features/motivos-cobro/pages/create/create')
            .then(m => m.CreateComponent)
      },
      {
        path: 'motivos-cobro/editar/:id',
        loadComponent: () =>
          import('./features/motivos-cobro/pages/edit/edit')
            .then(m => m.EditComponent)
      },
      {
        path: 'motivos-cobro',
        loadComponent: () =>
          import('./features/motivos-cobro/pages/list/list')
            .then(m => m.ListComponent)
      },

      // Comprobantes
      {
        path: 'comprobantes/nuevo',
        loadComponent: () =>
          import('./features/comprobantes/pages/create/create')
            .then(m => m.CreateComponent)
      },
      {
        path: 'comprobantes/editar/:id',
        loadComponent: () =>
          import('./features/comprobantes/pages/create/create')
            .then(m => m.CreateComponent)
      },
      {
        path: 'comprobantes',
        loadComponent: () =>
          import('./features/comprobantes/pages/list/list')
            .then(m => m.ListComponent)
      },

      // Deudas
      {
        path: 'deudas',
        loadComponent: () =>
          import('./features/deudas/pages/list/list')
            .then(m => m.ListComponent)
      },

      // Pagos
      {
        path: 'pagos/nuevo',
        loadComponent: () =>
          import('./features/pagos/pages/create/create')
            .then(m => m.CreateComponent)
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/pagos/pages/list/list')
            .then(m => m.ListComponent)
      },

      // Reportes
      {
      path: 'reportes/caja',
      loadComponent: () =>
        import('./features/reportes/pages/reporte-caja/reporte-caja')
          .then(m => m.ReporteCajaComponent)
    },

    // Default
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
