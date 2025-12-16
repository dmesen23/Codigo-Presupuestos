import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { OperacionesComponent } from './componentes/operaciones/operaciones.component';
import { CrearPresupuestoComponent } from './componentes/crear-presupuesto/crear-presupuesto.component';
import { AdministrarPresupuestoComponent } from './componentes/administrar-presupuesto/administrar-presupuesto.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: InicioComponent },
    { path: 'procesos', component: OperacionesComponent },
    { path: 'agregar', component: CrearPresupuestoComponent },
    { path: 'administrar', component: AdministrarPresupuestoComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '/inicio' }
];
