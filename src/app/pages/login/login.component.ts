import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  formLogin;
  loginAttempted: boolean = false;
  userNotFound: boolean = false; 

  //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]
  constructor(private formSvc:FormBuilder,
    private auth:AuthService,
    private router:Router
  ){
    this.formLogin = this.formSvc.group({
      'email':['', [Validators.required, Validators.email]],
      'password':['', [Validators.required]],
    });
  }

  /*userExists() {
     const findUser = this.auth.checkUser(this.formLogin.value as any);
    if (!findUser) {
      
      this.isthereuser = false;
      this.router.navigate(['/login']);
    }  
  }*/
  
  onRegister(){
    
    this.router.navigate(['/register']);
  }
  onSubmit(){

    this.loginAttempted = true;

    if (!this.auth.checkUser(this.formLogin.value.email as any)) {
      this.userNotFound = true;
      return;
    }

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    
   


    const succes = this.auth.login(this.formLogin.value as any);

      console.log('user signal antes de navigate:', this.auth.user());
      if (succes) {
        alert('Login correcto');
      this.router.navigate(['/dashboard']);
        
      }else {
        alert('Login incorrecto');
        this.router.navigate(['/login']);
      }
  }

  getError(control:string){
       
    switch(control){
      case 'email':
        if(this.formLogin.controls.email.errors!=null && 
           Object.keys(this.formLogin.controls.email.errors).includes('required'))
           return "El campo email es requerido";
        else if(this.formLogin.controls.email.errors!=null && 
           Object.keys(this.formLogin.controls.email.errors).includes('email'))
           return "El email no es correcto";
        
        break;
      case 'password': 
        if(this.formLogin.controls.password.errors!=null && 
           Object.keys(this.formLogin.controls.password.errors).includes('required'))
           return "El campo email es requerido";
        break;
      default:return "";
    }
    return "";
  }

}
