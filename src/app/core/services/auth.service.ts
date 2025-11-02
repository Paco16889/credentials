//esta rama sera igual que la main pero añaiendo las mejoras de JuanA el viernes 31
import { Injectable, signal } from '@angular/core';
import { Credentials } from '../models/credentials';

export interface User{
  name?: string;
  surname: string;
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _user:any={
      name: "Juan",
      surname: "García",
      email: "juan@juan.es"
  };

  //public user:any|null;
 // se sustituye por un signal para manejar el usuario de forma reactiva
 public user = signal<User | null>(null);

 //modificaciond el constructor
  constructor() { 
    //this.user = signal<any>(null);
    //let cookie = localStorage.getItem('AUTHENTICATION');
    //if(cookie)
      //this.user.set(this._user);
    const saved = localStorage.getItem('AUTHENTICATION');
    if (saved) {
      this.user.set(JSON.parse(saved));
    }
  }

  //Registrar nuevo usuario
  register(newUser: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('USERS') || '[]');

    //Comprobar si ya existe un usuario con el mismo email
    if(users.some(u => u.email === newUser.email)){
      return false;
    }

    //guarda el nuevo usuario
    users.push(newUser);
    localStorage.setItem('USERS', JSON.stringify(users));
    return true;
  }

  login(credentials:Credentials){

    //localStorage.setItem('AUTHENTICATION', JSON.stringify(credentials));
    
    //this.user.set(this._user)

    //Cargar usuarios registrados
     const users: User[] = JSON.parse(localStorage.getItem('USERS') || '[]');

     //buscar usuario que coincida con email y password
     const found = users.find(u => u.email === credentials.email && u.password === credentials.password);

     //sino lo encontramos el login devuelve falso
     if(!found){
      return false;
     }

     //si lo encontramos, guardamos usuario autenticado en localStorage
     localStorage.setItem('AUTHENTICATION', JSON.stringify(found));

     //actualiza signal 
     this.user.set(found);

     //devuelve true si login exitoso
     return true;
  }


   checkUser(credentials: Credentials){
    const users: User[] = JSON.parse(localStorage.getItem('USERS') || '[]');

    if (!users.find(u => u.email === credentials.email)) {
      
      return false;
   }
   return true;
  }



   logout(){
    localStorage.removeItem('AUTHENTICATION');
    this.user.set(null);
  }

}
