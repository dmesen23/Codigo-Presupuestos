import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresupuestoService } from '../../service/presupuesto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  cantidadPresupuestos = 0;
  presupuestosAgotados = 0;
  mesConMayorPresupuesto = '';
  categoriaConMayorConsumo = '';

  constructor(private presupuestoService: PresupuestoService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cantidadPresupuestos = this.presupuestoService.obtenerCantidadPresupuestos();
    this.presupuestosAgotados = this.presupuestoService.obtenerPresupuestosAgotados();
    this.mesConMayorPresupuesto = this.presupuestoService.obtenerMesConMayorPresupuesto();
    this.categoriaConMayorConsumo = this.presupuestoService.obtenerCategoriaConMayorConsumo();
  }
}