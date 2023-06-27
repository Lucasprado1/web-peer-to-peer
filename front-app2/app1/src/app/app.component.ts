import { Component } from '@angular/core';
import { App1Service } from './app1.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app1';
  constructor(private app1service: App1Service) { }
  
  enviarDadosParaBackend() {
    const dados = {
      // Dados a serem enviados para o backend
      teste: "oi da app2"
    };

    this.app1service.enviarDados(dados).subscribe(
      response => {
        // Lógica para manipular a resposta do backend
      },
      error => {
        // Lógica para lidar com erros na chamada ao backend
      }
    );
  }
}




