import { Component } from '@angular/core';
import { App1Service } from './app1.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ngOnInit() {
    this.app1service.startDataUpdates();
  }
  title = 'app1';

  constructor(private app1service: App1Service) {

  }

  public texto: any = '';
  public chave: any = '';
  public selectedOption: any = 'RC4';
  send(){
    console.log(this.texto);
    console.log(this.chave);
    console.log(this.selectedOption);

    const dados = {
      // Dados a serem enviados para o backend
      texto: this.texto,
      chave: this.chave,
      criptografia: this.selectedOption
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
