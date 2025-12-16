
import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresupuestoService } from '../../service/presupuesto.service'; 
import { IGasto } from '../../interface/gasto.interface'; 

@Component({
  selector: 'app-ingresar-gasto',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  
  template: `
    <div class="card p-4">
        <h2>Ingresar Gasto</h2>

        <div *ngIf="errorGasto()" class="alert alert-danger">
            NOMBRE GASTO O CANTIDAD INCORRECTA
        </div>
        <div *ngIf="errorSobreGasto()" class="alert alert-danger">
            CANTIDAD INGRESADA ES MAYOR AL RESTANTE
        </div>
        
        <div class="form-control-group">
            <label for="gasto">Gasto</label>
            <input 
                id="gasto" 
                type="text" 
                placeholder="Ej: Comida..."
                [(ngModel)]="nombreGasto"
            >
        </div>

        <div class="form-control-group">
            <label for="cantidad">Cantidad</label>
            <input 
                id="cantidad" 
                type="number" 
                placeholder="0"
                [(ngModel)]="cantidadGasto"
            >
        </div>

        <button class="btn btn-secondary" (click)="agregarGasto()">AGREGAR GASTO</button>
    </div>
  `,
  styles: [] // Estilos vacíos
})
export class IngresarGastoComponent {
    private presupuestoService = inject(PresupuestoService);
    
    nombreGasto: string = '';
    cantidadGasto: number = 0;

    errorGasto = signal<boolean>(false);
    errorSobreGasto = signal<boolean>(false);

    agregarGasto(): void {
        this.errorGasto.set(false);
        this.errorSobreGasto.set(false);

        
        if (this.nombreGasto.trim() === '' || this.cantidadGasto <= 0 || isNaN(this.cantidadGasto)) {
            this.errorGasto.set(true);
            return;
        }

        const nuevoGasto: IGasto = { nombre: this.nombreGasto, cantidad: this.cantidadGasto };

        
        const agregadoConExito: boolean = this.presupuestoService.agregarGasto(nuevoGasto);

        if (!agregadoConExito) {
            this.errorSobreGasto.set(true);
            return;
        }

        
        this.nombreGasto = '';
        this.cantidadGasto = 0;
    }
}