import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  nombreCompleto = 'Davis Bejarano Mesen'; 

  constructor(private router: Router) {}

  ingresar() {
    this.router.navigate(['/dashboard']);
  }
}