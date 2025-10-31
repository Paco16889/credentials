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
  registrationError : string = '';
  registrationSuccess: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router){
    // Creamos el formulario reactivo con validaciones
    this.formRegister = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]]
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

  //this.router.navigate(['/dashboard']) no lleva al dashboard mriar autoguards y service
    this.router.navigate(['/login']);
  }

 getError(control:string){
       
    switch(control){
      case 'email':
        if(this.formRegister.controls.email.errors!=null && 
           Object.keys(this.formRegister.controls.email.errors).includes('required'))
           return "El campo email es requerido";
        else if(this.formRegister.controls.email.errors!=null && 
           Object.keys(this.formRegister.controls.email.errors).includes('email'))
           return "El email no es correcto";
        
        break;
      case 'password': 
        if(this.formRegister.controls.password.errors!=null && 
           Object.keys(this.formRegister.controls.password.errors).includes('required'))
           return "El campo email es requerido";
        break;
      default:return "";
    }
    return "";
  }

}
