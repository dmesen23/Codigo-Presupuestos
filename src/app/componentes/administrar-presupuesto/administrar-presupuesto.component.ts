import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoService, Presupuesto } from '../../service/presupuesto.service';

@Component({
  selector: 'app-administrar-presupuesto',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './administrar-presupuesto.component.html',
  styleUrl: './administrar-presupuesto.component.css'
})
export class AdministrarPresupuestoComponent implements OnInit {
  private presupuestoService = inject(PresupuestoService);
  
  presupuestos: Presupuesto[] = [];
  
  gasto = {
    presupuestoId: '',
    nombre: '',
    categoria: '',
    cantidad: 0
  };

  categorias = [
    'Comida',
    'Universidad',
    'Transporte',
    'Servicios',
    'Pasajes',
    'Entretenimiento',
    'Salud',
    'Otros'
  ];

  mensaje = '';
  tipoMensaje: 'success' | 'error' = 'success';

  ngOnInit() {
    this.cargarPresupuestos();
  }

  cargarPresupuestos() {
    this.presupuestos = this.presupuestoService.obtenerPresupuestos();
  }

  agregarGasto() {
    if (!this.validarFormulario()) {
      return;
    }

    const resultado = this.presupuestoService.agregarGastoAPresupuesto(
      this.gasto.presupuestoId,
      {
        nombre: this.gasto.nombre,
        categoria: this.gasto.categoria,
        cantidad: this.gasto.cantidad
      }
    );
    
    this.tipoMensaje = resultado.success ? 'success' : 'error';
    this.mensaje = resultado.message;

    if (resultado.success) {
      this.limpiarFormulario();
      this.cargarPresupuestos();
    }

    setTimeout(() => {
      this.mensaje = '';
    }, 5000);
  }

  validarFormulario(): boolean {
    if (!this.gasto.presupuestoId) {
      this.mostrarError('Debe seleccionar un presupuesto');
      return false;
    }

    if (!this.gasto.nombre.trim()) {
      this.mostrarError('Debe ingresar un nombre para el gasto');
      return false;
    }

    if (!this.gasto.categoria) {
      this.mostrarError('Debe seleccionar una categoría');
      return false;
    }

    if (this.gasto.cantidad <= 0) {
      this.mostrarError('El monto debe ser mayor a 0');
      return false;
    }

    return true;
  }

  mostrarError(mensaje: string) {
    this.tipoMensaje = 'error';
    this.mensaje = mensaje;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  limpiarFormulario() {
    this.gasto = {
      presupuestoId: '',
      nombre: '',
      categoria: '',
      cantidad: 0
    };
  }

  obtenerSaldoDisponible(presupuestoId: string): number {
    const presupuesto = this.presupuestos.find(p => p.id === presupuestoId);
    return presupuesto ? presupuesto.monto - presupuesto.gastado : 0;
  }
}