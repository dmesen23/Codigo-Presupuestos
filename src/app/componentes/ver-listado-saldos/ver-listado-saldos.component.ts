
import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgClass, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { PresupuestoService } from '../../service/presupuesto.service'; 

@Component({
  selector: 'app-ver-listado-saldos',
  standalone: true,
  
  imports: [CommonModule, NgClass, CurrencyPipe, NgFor, NgIf], 
  templateUrl: './ver-listado-saldos.component.html',
  styleUrl: './ver-listado-saldos.component.css'
})
export class VerListadoSaldosComponent {
    private presupuestoService = inject(PresupuestoService);
    
    
    presupuestoTotal = this.presupuestoService.presupuestoTotal;
    presupuestoRestante = this.presupuestoService.presupuestoRestante;
    listaGastos = this.presupuestoService.listaGastos;
    
    
    claseRestante = computed(() => {
        const total = this.presupuestoTotal();
        const restante = this.presupuestoRestante();
        
        if (total === 0) {
            return 'normal';
        }
        
        
        if (restante <= total * 0.25) { 
            return 'alerta-roja';
        }
        
        
        if (restante <= total / 3) {
            return 'alerta-amarilla';
        }

        return 'normal';
    });
}