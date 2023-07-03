const net = require('net');
const sdes = require('./sdesjs.js');
const rc4 = require('./rc4js.js');
const readline = require('readline');
const express = require('express');
const cors = require('cors');
const app = express();
let dados_recebidos = ""

const a = 5
const p = 97
var yb=null;
var ya=0;
var key = null;
const iv = "10101010"

function generateIV() {
  var iv = "";
  for (var i = 0; i < 8; i++) {
    iv += Math.floor(Math.random() * 2).toString();
  }
  return iv;
}


function iniciarServidor() {
  const server = net.createServer((socket) => {
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
      console.log(`Dados recebidos do cliente: ${data}`);


      dataObject = JSON.parse(data); //GERA OBJETO
      if(dataObject.sharingKey){
        yb= dataObject.key
        var xa = Math.floor(Math.random() * p);
        ya = (a * xa) % p
        socket.write(JSON.stringify({value: ya}));
        key = String((yb* xa) % p)
        console.log("Chave DH após todos os calculos:", key)
      }
      else{
        console.log('antes da descriptografia :', dataObject.texto);
        if(dataObject.criptografia == 'RC4'){
          const rc4descriptografado = rc4.rc4Decrypt(dataObject.texto, dataObject.isDh? key : dataObject.chave);
          console.log('O valor descriptografado é :', rc4descriptografado); //PRINTANDO DEPOIS DO CÓDIGO EM C TER CONVERTIDO
          dadoRecebidoCriptografado = {
            texto: rc4descriptografado,
            chave: dataObject.isDh? key : dataObject.chave,
            criptografia: 'RC4'
          }
        }
        else{
          if(dataObject.sdesType && dataObject.sdesType =="ecb"){
            var sdesdescriptografado = sdes.ecbDecrypt(dataObject.isDh? key : dataObject.chave, dataObject.texto);
            console.log('sdes descriptografado com ECB para envio', sdesdescriptografado);
          }
          else {
            var sdesdescriptografado = sdes.cbcDecrypt(dataObject.isDh? key : dataObject.chave, dataObject.texto, iv);
            console.log('sdes descriptografado com cbc para envio', sdesdescriptografado);
          }
          // const sdesdescriptografado = sdes.descriptografar(dataObject.isDh? key : dataObject.chave, dataObject.texto);
          // console.log('O valor descriptografado é :', sdesdescriptografado); //PRINTANDO DEPOIS DO CÓDIGO EM C TER CONVERTIDO
          dadoRecebidoCriptografado = {
            texto: sdesdescriptografado,
            chave: dataObject.isDh? key : dataObject.chave,
            criptografia: 'SDES'
          }
        }

        dados_recebidos = dadoRecebidoCriptografado.texto;
      }

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

    clienteTCP.write(dados);

    //console.log('eniviando chave e texto', dataObject.chave, dataObject.texto)

    // Enviar dados para o servidor TCP


    // Fechar a conexão após o envio dos dados
    clienteTCP.end();
  });

  clienteTCP.on('data', (data) => {
    data = JSON.parse(data);
    yb = data.value;
    console.log(`Chave recebida: ${data.value}`);
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

app.post('/dados', async (req, res) => {
  const dadosRecebidos = req.body; // Obter os dados enviados pelo Angular

  // Executar a lógica desejada com os dados recebidos
  console.log('Dados recebidos do Angular:', dadosRecebidos);
  dadoRecebidoCriptografado = {}
  dataObject = JSON.parse(JSON.stringify(dadosRecebidos)); //GERA OBJETO PARA INTEGRAR COM C

  if (dataObject.isDh) {
    xa = Math.floor(Math.random() * p);
    ya = (a * xa) % p;
    enviarDadosParaServidorTCP(JSON.stringify({ sharingKey: true, key: ya }));

    await new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (yb !== null) {
          clearInterval(intervalId);
          key = String((yb * xa) % p);
          console.log("Chave DH após todos os cálculos:", key);
          resolve();
        }
      }, 100);
    });

  }
  if(dataObject.criptografia == 'RC4'){
    const rc4criptografado = rc4.rc4Encrypt(dataObject.texto, dataObject.isDh? key : dataObject.chave);
    console.log('rc4 criptografado para envio', rc4criptografado);

    dadoRecebidoCriptografado = {
      texto: rc4criptografado,
      chave: dataObject.isDh? key : dataObject.chave,
      criptografia: 'RC4'
    }
  }
  else{
    if(dataObject.sdesType && dataObject.sdesType =="ecb"){
      var sdescriptografado = sdes.ecbEncrypt(dataObject.isDh? key : dataObject.chave, dataObject.texto);
      console.log('sdes criptografado com ECB para envio', sdescriptografado);
    }
    else {
      var sdescriptografado = sdes.cbcEncrypt(dataObject.isDh? key : dataObject.chave, dataObject.texto, iv);
      console.log('sdes criptografado com cbc para envio', sdescriptografado);
    }
    // const sdescriptografado = sdes.criptografar(dataObject.isDh? key : dataObject.chave, dataObject.texto);
    // console.log('sdes criptografado para envio', sdescriptografado);

    dadoRecebidoCriptografado = {
      texto: sdescriptografado,
      chave: dataObject.isDh? key : dataObject.chave,
      criptografia: 'SDES',
      sdesType: dataObject.sdesType
    }

  }
  enviarDadosParaServidorTCP(JSON.stringify(dadoRecebidoCriptografado));
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
