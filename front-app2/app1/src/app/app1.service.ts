import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class App1Service {

  private apiUrl = 'http://localhost:4040'; // Substitua pela URL do seu backend Node.js

  constructor(private http: HttpClient) { }

  enviarDados(dados: any) {
    console.log(dados)
    return this.http.post(`${this.apiUrl}/dados`, dados);
  }

  startDataUpdates() {
    // Chama o método inicialmente e, em seguida, a cada 2 segundos
    this.receiveDataFromBackend();
    interval(2000).subscribe(() => {
      this.receiveDataFromBackend();
    });
  }

  receiveDataFromBackend() {
    this.http.get<any>('http://localhost:4000/pegardados').subscribe(
      response => {
        console.log('Dados recebidos do backend:', response);
        // Faça o processamento necessário com os dados recebidos do backend
      }
    );
  }
}

