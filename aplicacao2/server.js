const net = require('net');
const readline = require('readline');
const sdes = require('./sdesjs.js');
const rc4 = require('./rc4js.js');
const express = require('express');
const cors = require('cors');
const app = express();
let dados_recebidos = ""

function iniciarServidor() {
  const server = net.createServer((socket) => {
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
      console.log(`Dados recebidos do cliente: ${data}`);
      dataObject = JSON.parse(data); //GERA OBJETO PARA INTEGRAR COM C
      console.log('antes da descriptografia :', dataObject.texto);

      if(dataObject.criptografia == 'RC4'){
        const rc4descriptografado = rc4.rc4Decrypt(dataObject.texto, dataObject.chave);
        console.log('O valor descriptografado é :', rc4descriptografado);
        dadoRecebidoCriptografado = {
          texto: rc4descriptografado,
          chave: dataObject.chave,
          criptografia: 'RC4'
        }
      }
      else{
        const sdesdescriptografado = sdes.descriptografar(dataObject.chave, dataObject.texto);
        console.log('O valor descriptografado é :', sdesdescriptografado);
        dadoRecebidoCriptografado = {
          texto: sdesdescriptografado,
          chave: dataObject.chave,
          criptografia: 'SDES'
        }
      }

      dados_recebidos = dadoRecebidoCriptografado.texto;

      const response = 'Resposta do servidor';
      socket.write(response);
    });


    socket.on('end', () => {
      console.log('Cliente desconectado.');
    });

  });

  const PORT = 3030;

  server.listen(PORT, () => {
    console.log(`Servidor TCP ouvindo na porta ${PORT}`);
  });
}

const LigaServidor = true;

if (LigaServidor) {
  iniciarServidor();
}

function desligaServidor(){
  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });
}


// Função para enviar dados ao servidor TCP
function enviarDadosParaServidorTCP(dados) {
  const clienteTCP = net.createConnection({ port: 3000 }, () => {
    console.log('Conectado para envio ao servidor TCP 1.');

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

  dataObject = JSON.parse(JSON.stringify(dadosRecebidos)); //GERA OBJETO PARA INTEGRAR COM C

  if(dataObject.criptografia == 'RC4'){
    const rc4criptografado = rc4.rc4Encrypt(dataObject.texto, dataObject.chave);
    console.log('rc4 criptografado para envio', rc4criptografado);

    dadoRecebidoCriptografado = {
      texto: rc4criptografado,
      chave: dataObject.chave,
      criptografia: 'RC4'
    }
  }
  else{
    const sdescriptografado = sdes.criptografar(dataObject.chave, dataObject.texto);
    console.log('sdes criptografado para envio', sdescriptografado);

    dadoRecebidoCriptografado = {
      texto: sdescriptografado,
      chave: dataObject.chave,
      criptografia: 'SDES'
    }

  }

  enviarDadosParaServidorTCP(JSON.stringify(dadoRecebidoCriptografado));
  res.status(200).json({ message: 'Dados recebidos com sucesso!' });
});

const PORT = 4040;
app.listen(PORT, () => {
  console.log(`Servidor HTTP ouvindo na porta ${PORT}`);
});

// Rota GET para receber dados
app.get('/pegardados', (req, res) => {
  // Executar a lógica para recuperar os dados desejados

  // Enviar os dados como resposta
  res.status(200).json(dados_recebidos);
});
