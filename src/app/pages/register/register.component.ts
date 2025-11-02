import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';


 function passwordMatches(control:AbstractControl):ValidationErrors | null {
  const group:FormGroup = control as FormGroup;
  if (group.controls['password'].value != group.controls['confirmPassword'].value) {
    group.controls['confirmPassword'].setErrors({'passwordMatch': null});
    return {'passwordMatch':null};
  }
  
  
  return null;
  }
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  formRegister: FormGroup;
  registrationError : string = '';
  registrationSuccess: boolean = false;
  builder: FormBuilder = inject(FormBuilder);
  auth: AuthService = inject(AuthService);
  router:Router = inject(Router);
  navigateTo:string = "";

 
  error;
  constructor(){
    // Creamos el formulario reactivo con validaciones
    this.formRegister = this.builder.group({
      'name': ['', [Validators.required, Validators.minLength(3)]],
      'surname': ['', [Validators.required, Validators.minLength(3)]],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      'confirmPassword':['',[Validators.required]]
    },{validators:[passwordMatches]});
    this.navigateTo = this.router.getCurrentNavigation()?.extras.state?.['navigateTo']||'dashboard';
    this.error = signal(false);
  }

  async onSubmitt(){
     try{
      await this.auth.register(this.formRegister.value);
      this.router.navigate([this.navigateTo]);
    }
    catch(error){
      
    }
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
        if(this.formRegister.controls['email'].errors!=null && 
           Object.keys(this.formRegister.controls['email'].errors).includes('required'))
           return "El campo email es requerido";
        else if(this.formRegister.controls['email'].errors!=null && 
           Object.keys(this.formRegister.controls['email'].errors).includes('email'))
           return "El email no es correcto";
        
        break;
        case 'name':
        if(this.formRegister.controls['name'].errors!=null && 
           Object.keys(this.formRegister.controls['name'].errors).includes('required'))
           return "El campo nombre es requerido";
        else if(this.formRegister.controls['name'].errors!=null && 
           Object.keys(this.formRegister.controls['name'].errors).includes('minlength'))
           return "Debe introducir al menos 3 caracteres";
        
        break;
        case 'surname':
        if(this.formRegister.controls['surname'].errors!=null && 
           Object.keys(this.formRegister.controls['surname'].errors).includes('required'))
           return "El campo apellidos es requerido";
        else if(this.formRegister.controls['surname'].errors!=null && 
           Object.keys(this.formRegister.controls['surname'].errors).includes('minlength'))
           return "Debe introducir al menos 3 caracteres";
        
        break;
      case 'password': 
        if(this.formRegister.controls['password'].errors!=null && 
           Object.keys(this.formRegister.controls['password'].errors).includes('required'))
           return "El campo email es requerido";
        break;
        case 'confirmPassword': 
        if(this.formRegister.controls['confirmPassword'].errors!=null && 
           Object.keys(this.formRegister.controls['confirmPassword'].errors).includes('required'))
           return "El campo password es requerido";
        if(this.formRegister.controls['confirmPassword'].errors!=null && 
           Object.keys(this.formRegister.controls['confirmPassword'].errors).includes('passwordMatch'))
           return "Las contranseñas no coinciden";
        break;
      default:return "";
    }
    return "";
  }

}
