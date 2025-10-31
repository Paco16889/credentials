import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  formRegister;
  registrationError = '';
  registrationSuccess = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router){
    // Creamos el formulario reactivo con validaciones
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    });
  }

  onSubmit() {
    if (this.formRegister.invalid) {
      this.registrationError = 'Por favor, corrige los errores del formulario';
      return;
    }

    const newUser: User = this.formRegister.value as User;

    const success = this.auth.register(newUser);

    if (!success) {
      this.registrationError = 'El usuario ya existe';
      this.registrationSuccess = false;
      return;
    }

    // Registro exitoso
    this.registrationSuccess = true;
    this.registrationError = '';
    this.formRegister.reset();

    // Opcional: redirigir al login después de unos segundos
    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

  getError(control: string): string {
    const c = this.formRegister.get(control);
    if (!c || !c.errors) return '';

    if (c.errors['required']) return 'Campo obligatorio';
    if (c.errors['email']) return 'Email inválido';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres`;
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres`;

    return '';
  }

}
