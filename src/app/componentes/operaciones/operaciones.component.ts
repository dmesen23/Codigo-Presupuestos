import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operaciones.component.html',
  styleUrl: './operaciones.component.css'
})
export class OperacionesComponent {

  constructor(private router: Router) {}

  irCrearPresupuesto() {
    this.router.navigate(['/agregar']);
  }

  irAgregarGasto() {
    this.router.navigate(['/administrar']);
  }
}