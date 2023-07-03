import { Component } from '@angular/core';
import { App1Service } from './app1.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  ngOnInit() {
    this.startDataUpdates();
  }
  title = 'app1';

  constructor(private app1service: App1Service) {

  }

  public texto: any = '';
  public chave: any = '';
  public selectedOption: any = 'RC4';
  public chatResponse = ''
  public isDh: boolean = false;
  public sdesType: any = 'ecb';
  send(){

    const dados = {
      // Dados a serem enviados para o backend
      texto: this.texto,
      chave: this.chave,
      criptografia: this.selectedOption,
      isDh: this.isDh,
      sdesType: this.selectedOption =="SDES"? this.sdesType:null
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

  startDataUpdates() {
    // Chama o método inicialmente e, em seguida, a cada 2 segundos
    this.app1service.receiveDataFromBackend();
    interval(2000).subscribe(() => {
      this.app1service.receiveDataFromBackend().subscribe( res =>{
        this.chatResponse = res
      });
    });
  }
}
