const net = require('net');
const readline = require('readline');

function iniciarServidor() {
  const server = net.createServer((socket) => {
    console.log('Cliente conectado.');

    socket.on('data', (data) => {
      console.log(`Dados recebidos do cliente: ${data}`);
      if (data == "desligar"){
        console.log('Mensagem do cliente solicitando desligamento do server')
        desligarServidor();
      }
      if (data == "cliente"){
        console.log('virando cliente e bugando tudo')
        iniciarCliente();
      }

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

function desligaServidor(){
  socket.on('end', () => {
    console.log('Cliente desconectado.');
  });
}


function iniciarCliente(){

  const client = net.createConnection({ port: 3030 }, () => {
    console.log('Conectado ao servidor.');

    // Enviar uma mensagem para o servidor
    client.write('Olá, servidor!');

    // Inicia a leitura do terminal para enviar mensagens
    startTerminalInput();
  });

  client.on('data', (data) => {
    console.log(`Resposta do servidor: ${data}`);
  });

  client.on('end', () => {
    console.log('Desconectado do servidor.');
  });

  function startTerminalInput() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.prompt();

    rl.on('line', (input) => {
      // Enviar a mensagem digitada no terminal para o servidor
      client.write(input);

      rl.prompt();
    }).on('close', () => {
      console.log('Fechando cliente.');
      process.exit(0);
    });
  }
}

