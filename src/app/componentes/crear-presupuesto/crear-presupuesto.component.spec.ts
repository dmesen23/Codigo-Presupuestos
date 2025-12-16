import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoService, Presupuesto } from '../../service/presupuesto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-presupuesto',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './crear-presupuesto.component.html',
  styleUrl: './crear-presupuesto.component.css'
})
export class CrearPresupuestoComponent implements OnInit {
  private presupuestoService = inject(PresupuestoService);
  private router = inject(Router);

  presupuestos: Presupuesto[] = [];
  
  presupuesto = {
    nombre: '',
    mes: '',
    monto: 0
  };

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  errorPresupuesto = signal<boolean>(false);
  mensajeExito = signal<boolean>(false);

  ngOnInit() {
    this.cargarPresupuestos();
  }

  cargarPresupuestos() {
    this.presupuestos = this.presupuestoService.obtenerPresupuestos();
  }

  simularAceptar(): void {
    this.errorPresupuesto.set(false);
    this.mensajeExito.set(false);

    if (!this.validarFormulario()) {
      return;
    }

    this.presupuestoService.agregarPresupuesto(this.presupuesto);
    this.mensajeExito.set(true);
    
    this.limpiarFormulario();
    this.cargarPresupuestos();

    setTimeout(() => {
      this.mensajeExito.set(false);
    }, 3000);
  }

  validarFormulario(): boolean {
    if (!this.presupuesto.nombre.trim()) {
      this.errorPresupuesto.set(true);
      return false;
    }

    if (!this.presupuesto.mes) {
      this.errorPresupuesto.set(true);
      return false;
    }

    if (this.presupuesto.monto <= 0 || isNaN(this.presupuesto.monto)) {
      this.errorPresupuesto.set(true);
      return false;
    }

    return true;
  }

  limpiarFormulario() {
    this.presupuesto = {
      nombre: '',
      mes: '',
      monto: 0
    };
  }

  obtenerPorcentajeGastado(presupuesto: Presupuesto): number {
    return (presupuesto.gastado / presupuesto.monto) * 100;
  }

  getClaseEstado(presupuesto: Presupuesto): string {
    const porcentaje = this.obtenerPorcentajeGastado(presupuesto);
    if (porcentaje >= 100) return 'agotado';
    if (porcentaje >= 75) return 'alerta';
    return 'normal';
  }
}