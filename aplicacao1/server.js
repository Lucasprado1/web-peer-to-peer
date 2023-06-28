const net = require('net');
const readline = require('readline');
const express = require('express');
const cors = require('cors');
const app = express();
let dados_recebidos = "sem dados recebidos"

// TRECHO DE INTEGRAÇÃO COM C
const ffi = require('ffi-napi');

// Carregar a biblioteca compartilhada
const lib = ffi.Library('./conversor.so', {
  'binaryToDecimal': ['int64', ['int64']] //aqui aparentemente ele invoca as fuções q tem no código C, pq binaryToDecimal é uma função do código
});

// Função para converter binário em decimal usando a biblioteca C
function convertBinaryToDecimal(binaryNumber) {
  return lib.binaryToDecimal(binaryNumber);
}

// Utilizar a função convertBinaryToDecimal() no código Node.js
const binaryNumber = 111; // Exemplo de número binário


// INTEGRAÇÃO COM C


function iniciarServidor() {
  const server = net.createServer((socket) => {
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
      console.log(`Dados recebidos do cliente: ${data}`);


      dataObject = JSON.parse(data); //GERA OBJETO PARA INTEGRAR COM C
      const decimalNumber = convertBinaryToDecimal(dataObject.texto); //INTEGRA COM C
      console.log('O valor em decimal é:', decimalNumber); //PRINTANDO DEPOIS DO CÓDIGO EM C TER CONVERTIDO

      dados_recebidos = `${data}`;


      // Processar os dados recebidos, se necessário

      // Enviar uma resposta de volta para o cliente
      const response = 'Resposta do servidor';
      socket.write(response);
    });


    socket.on('end', () => {
      console.log('Cliente desconectado.');
    });

  });

  const PORT = 3000;

  server.listen(PORT, () => {
    console.log(`Servidor TCP ouvindo na porta ${PORT}`);
  });
}

const LigaServidor = true;

if (LigaServidor) {
  iniciarServidor();
}


// Função para enviar dados ao servidor TCP
function enviarDadosParaServidorTCP(dados) {
  const clienteTCP = net.createConnection({ port: 3030 }, () => {
    console.log('Conectado ao servidor TCP.');

    // Enviar dados para o servidor TCP
    clienteTCP.write(dados);

    // Fechar a conexão após o envio dos dados
    clienteTCP.end();
  });

  clienteTCP.on('end', () => {
    console.log('Desconectado do servidor TCP.');
  });

  clienteTCP.on('error', (err) => {
    console.error('Erro na conexão com o servidor TCP:', err);
  });
}


app.use(cors());
app.use(express.json());

app.post('/dados', (req, res) => {
  const dadosRecebidos = req.body; // Obter os dados enviados pelo Angular

  // Executar a lógica desejada com os dados recebidos
  console.log('Dados recebidos do Angular:', dadosRecebidos);
  enviarDadosParaServidorTCP(JSON.stringify(dadosRecebidos));
  res.status(200).json({ message: 'Dados recebidos com sucesso!' });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor HTTP ouvindo na porta ${PORT}`);
});

// Rota GET para receber dados
app.get('/pegardados', (req, res) => {
  // Executar a lógica para recuperar os dados desejados

  // Enviar os dados como resposta
  res.status(200).json(dados_recebidos);
});
