import { inject, Injectable, signal } from '@angular/core';
import { Credentials, RegisterInfo } from '../models/credentials';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';


export interface LoginResponse {
  jwt: string
  user: StrapiUser
}

export interface StrapiUser {
  id: number
  documentId: string
  username: string
  name:string,
  surname:string,
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}
type _User = User | null;

@Injectable({
  providedIn: 'root'
})
export class StrapiAuthService {
  
  public user: any | null;
  public error: any | null;
  private token:string|null;
  private http:HttpClient = inject(HttpClient);

  constructor() {
    this.user = signal<any>(null);
    this.error = signal<any>(null);
    this.token = localStorage.getItem('token');
    this.me();
  }


  me(){
    if(this.token){
      this.http.get<StrapiUser>("http://localhost:1337/api/users/me",{
        headers:{
          "Authorization":`Bearer ${this.token}`
        }
      }).subscribe({
        next:(data)=>{
          const user:User = {
            name:data.name,
            surname:data.surname,
            email:data.email
          }
          this.setUser(user);
          
        },
        error:(err)=>{
          console.log(err);
        }
      });
    }    
  }

  setUser(user:User){
    this.user.set(user);
  }

  login(credentials: Credentials){
    const body = {
      identifier:credentials.email,
      password:credentials.password
    };
    this.http.post<LoginResponse>("http://localhost:1337/api/auth/local", body).subscribe({
      next:(data)=>{
        localStorage.setItem('token',data.jwt);
        const newUser:User = {
          email:data.user.email,
          name:data.user.name,
          surname:data.user.surname
        }
        this.setUser(newUser);
      },
      error:(err)=>{
        this.error.set(err);
      }
    })
  }

  logout() {
    this.user.set(null);
    this.user.error(null);
  }

  register(userInfo: RegisterInfo){
    
    
  }
}
