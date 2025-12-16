import { Injectable, signal } from '@angular/core';
import { IGasto } from '../interface/gasto.interface';

export interface Presupuesto {
  id: string;
  nombre: string;
  mes: string;
  monto: number;
  gastado: number;
  gastos: GastoDetallado[];
}

export interface GastoDetallado extends IGasto {
  id: string;
  categoria: string;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
  private STORAGE_KEY = 'presupuestos_finanzapp';
  
  // Mantener compatibilidad con código existente
  presupuestoTotal = signal<number>(0);
  presupuestoRestante = signal<number>(0);
  listaGastos = signal<IGasto[]>([]);
  presupuestoEstablecido = signal<boolean>(false);

  constructor() {
    this.inicializarDatos();
  }

  private inicializarDatos() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Métodos legacy (mantener compatibilidad)
  establecerPresupuesto(monto: number): void {
    if (monto > 0) {
      this.presupuestoTotal.set(monto);
      this.presupuestoRestante.set(monto);
      this.presupuestoEstablecido.set(true);
    }
  }

  agregarGasto(gasto: IGasto): boolean {
    const nuevoRestante = this.presupuestoRestante() - gasto.cantidad;

    if (nuevoRestante >= 0) {
      this.presupuestoRestante.set(nuevoRestante);
      this.listaGastos.update(gastos => [...gastos, gasto]);
      return true;
    } else {
      return false;
    }
  }

  // Nuevos métodos para múltiples presupuestos
  obtenerPresupuestos(): Presupuesto[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      return [];
    }
  }

  agregarPresupuesto(presupuesto: Omit<Presupuesto, 'id' | 'gastado' | 'gastos'>): Presupuesto {
    const presupuestos = this.obtenerPresupuestos();
    const nuevoPresupuesto: Presupuesto = {
      ...presupuesto,
      id: this.generarId(),
      gastado: 0,
      gastos: []
    };
    presupuestos.push(nuevoPresupuesto);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presupuestos));
    return nuevoPresupuesto;
  }

  obtenerPresupuestoPorId(id: string): Presupuesto | undefined {
    const presupuestos = this.obtenerPresupuestos();
    return presupuestos.find(p => p.id === id);
  }

  agregarGastoAPresupuesto(
    presupuestoId: string,
    gasto: { nombre: string; categoria: string; cantidad: number }
  ): { success: boolean; message: string } {
    const presupuesto = this.obtenerPresupuestoPorId(presupuestoId);
    
    if (!presupuesto) {
      return { success: false, message: 'Presupuesto no encontrado' };
    }

    const saldoDisponible = presupuesto.monto - presupuesto.gastado;
    
    if (gasto.cantidad > saldoDisponible) {
      return { 
        success: false, 
        message: `Saldo insuficiente. Disponible: ₡${saldoDisponible.toFixed(2)}` 
      };
    }

    if (gasto.cantidad <= 0) {
      return { success: false, message: 'El monto debe ser mayor a 0' };
    }

    const nuevoGasto: GastoDetallado = {
      id: this.generarId(),
      nombre: gasto.nombre,
      cantidad: gasto.cantidad,
      categoria: gasto.categoria,
      fecha: new Date()
    };

    const presupuestos = this.obtenerPresupuestos();
    const index = presupuestos.findIndex(p => p.id === presupuestoId);
    
    if (index !== -1) {
      presupuestos[index].gastos.push(nuevoGasto);
      presupuestos[index].gastado += gasto.cantidad;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presupuestos));
    }

    return { success: true, message: 'Gasto agregado exitosamente' };
  }

  // Métodos para Dashboard
  obtenerCantidadPresupuestos(): number {
    return this.obtenerPresupuestos().length;
  }

  obtenerPresupuestosAgotados(): number {
    const presupuestos = this.obtenerPresupuestos();
    return presupuestos.filter(p => p.gastado >= p.monto).length;
  }

  obtenerMesConMayorPresupuesto(): string {
    const presupuestos = this.obtenerPresupuestos();
    if (presupuestos.length === 0) return 'N/A';
    
    const maxPresupuesto = presupuestos.reduce((max, p) => 
      p.monto > max.monto ? p : max
    , presupuestos[0]);
    
    return maxPresupuesto.mes;
  }

  obtenerCategoriaConMayorConsumo(): string {
    const presupuestos = this.obtenerPresupuestos();
    const todosGastos = presupuestos.flatMap(p => p.gastos);
    
    if (todosGastos.length === 0) return 'N/A';
    
    const categorias = todosGastos.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.cantidad;
      return acc;
    }, {} as { [key: string]: number });
    
    const maxCategoria = Object.entries(categorias).reduce((max, [cat, monto]) => 
      monto > max[1] ? [cat, monto] : max
    , ['', 0]);
    
    return maxCategoria[0];
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}