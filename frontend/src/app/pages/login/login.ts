import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // 👈 Agregado aquí
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('✅ Login exitoso');
          this.router.navigate(['/players']); // Cambiará al listado cuando lo implementemos
        },
        error: err => {
          console.error('❌ Login fallido:', err);
          this.errorMessage = 'Credenciales incorrectas';
        }
      });
    } else {
      console.log('❌ Formulario inválido');
      this.errorMessage = 'Por favor completá todos los campos';
    }
  }
}
