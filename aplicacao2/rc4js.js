function rc4Encrypt(plaintext, key) {
    var keyBytes = [];
    var ciphertext = [];

    // Convertendo a chave em uma matriz de bytes
    for (var i = 0; i < key.length; i++) {
      keyBytes.push(key.charCodeAt(i));
    }

    // Inicializando o estado do gerador de fluxo RC4
    var state = [];
    for (var i = 0; i < 256; i++) {
      state[i] = i;
    }

    // Embaralhando o estado do gerador de fluxo RC4 com base na chave
    var j = 0;
    for (var i = 0; i < 256; i++) {
      j = (j + state[i] + keyBytes[i % keyBytes.length]) % 256;
      // Troca dos valores de state[i] e state[j]
      var temp = state[i];
      state[i] = state[j];
      state[j] = temp;
    }

    // Gerando o fluxo criptográfico e cifrando o plaintext
    var i = 0;
    j = 0;
    for (var k = 0; k < plaintext.length; k++) {
      i = (i + 1) % 256;
      j = (j + state[i]) % 256;
      // Troca dos valores de state[i] e state[j]
      var temp = state[i];
      state[i] = state[j];
      state[j] = temp;

      var keystreamByte = state[(state[i] + state[j]) % 256];
      var plaintextByte = plaintext.charCodeAt(k);
      var encryptedByte = keystreamByte ^ plaintextByte; // Operação XOR

      ciphertext.push(encryptedByte);
    }

    // Convertendo a sequência de bytes cifrados para formato hexadecimal
    var hexString = "";
    for (var i = 0; i < ciphertext.length; i++) {
      var hexByte = ciphertext[i].toString(16);
      if (hexByte.length < 2) {
        hexByte = "0" + hexByte; // Adicionando zero à esquerda, se necessário
      }
      hexString += hexByte + ":";
    }

    return hexString.slice(0, -1); // Removendo o último ":" da sequência
}

function rc4Decrypt(ciphertext, key) {
    var keyBytes = [];
    var plaintext = "";

    // Convertendo a chave em uma matriz de bytes
    for (var i = 0; i < key.length; i++) {
        keyBytes.push(key.charCodeAt(i));
    }

    // Convertendo a sequência de bytes cifrados para matriz de bytes
    var ciphertextBytes = ciphertext.split(":").map(function(byteStr) {
        return parseInt(byteStr, 16);
    });

    // Inicializando o estado do gerador de fluxo RC4
    var state = [];
    for (var i = 0; i < 256; i++) {
        state[i] = i;
    }

    // Embaralhando o estado do gerador de fluxo RC4 com base na chave
    var j = 0;
    for (var i = 0; i < 256; i++) {
        j = (j + state[i] + keyBytes[i % keyBytes.length]) % 256;
        // Troca dos valores de state[i] e state[j]
        var temp = state[i];
        state[i] = state[j];
        state[j] = temp;
    }

    // Gerando o fluxo criptográfico e decifrando o ciphertext
    var i = 0;
    j = 0;
    for (var k = 0; k < ciphertextBytes.length; k++) {
        i = (i + 1) % 256;
        j = (j + state[i]) % 256;
        // Troca dos valores de state[i] e state[j]
        var temp = state[i];
        state[i] = state[j];
        state[j] = temp;

        var keystreamByte = state[(state[i] + state[j]) % 256];
        var decryptedByte = keystreamByte ^ ciphertextBytes[k]; // Operação XOR
        var decryptedChar = String.fromCharCode(decryptedByte);

        plaintext += decryptedChar;
    }

    return plaintext;
}

module.exports = {
    rc4Encrypt: rc4Encrypt,
    rc4Decrypt: rc4Decrypt
};

// Exemplo de uso


