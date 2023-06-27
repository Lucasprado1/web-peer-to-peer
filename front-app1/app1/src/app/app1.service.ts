import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class App1Service {

  private apiUrl = 'http://localhost:4000'; // Substitua pela URL do seu backend Node.js

  constructor(private http: HttpClient) { }

  enviarDados(dados: any) {
    console.log(dados)
    return this.http.post(`${this.apiUrl}/dados`, dados);
  }
}
