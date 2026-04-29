import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {

  usuario: any = null;
  fechaActual = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  get nombreUsuario(): string {
    return this.usuario?.username || 'Invitado';
  }

  get rolUsuario(): string {
    if (!this.usuario?.roles || this.usuario.roles.length === 0) {
      return 'SIN ROL';
    }

    return this.usuario.roles[0].nombre;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}