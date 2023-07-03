
let P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
let P8 = [6, 3, 7, 4, 8, 5, 10, 9];
let IP = [2, 6, 3, 1, 4, 8, 5, 7];
let PI = [4, 1, 3, 5, 7, 2, 8, 6];
let EX = [4, 1, 2, 3, 2, 3, 4, 1];
let P4 = [2, 4, 3, 1];

let S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2],
];

let S1 = [
  [1, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3],
];

function permutation(bits, indexes, size) {
  let response = new Array(size);
  for(let i = 0; i < size; i++)
    response[i] = bits[indexes[i] - 1];
  return response.join('');
}

function substring(bits, init, size) {
  return bits.substr(init, size);
}

function rotate(bits, displacement, size) {
  let first_bits = bits.substr(0, displacement);
  return bits.substr(displacement) + first_bits;
}

function concat(left, right) {
  return left + right;
}

function get_keys(k) {
  let p10 = permutation(k, P10, 10);

  let left = substring(p10, 0, 5);
  let right = substring(p10, 5, 5);

  left = rotate(left, 1, 5);
  right = rotate(right, 1, 5);

  let k1 = permutation(concat(left, right), P8, 8);
  let k2 = permutation(concat(rotate(left, 2, 5), rotate(right, 2, 5)), P8, 8);
  return [k1, k2];
}

function swap(bits) {
  let size = bits.length;
  let limit = size / 2;
  return concat(substring(bits, limit, size), substring(bits, 0, limit));
}

function xor(bits, key, size) {
  let response = new Array(size);
  for(let i = 0; i < size; i++)
    response[i] = (bits[i] === '1' && key[i] === '0' || bits[i] === '0' && key[i] === '1') ? '1' : '0';
  return response.join('');
}

function expand(bits) {
  return permutation(bits, EX, 8);
}

function binary_to_integer(a, b) {
  if(a === '0' && b === '0')
    return 0;
  if(a === '0' && b === '1')
    return 1;
  if(a === '1' && b === '0')
    return 2;
  if(a === '1' && b === '1')
    return 3;
  return -1;
}

function integer_to_binary

(i) {
  if(i === 0)
    return "00";
  if(i === 1)
    return "01";
  if(i === 2)
    return "10";
  if(i === 3)
    return "11";
  return "";
}

function blocks(bits) {
  let left = substring(bits, 0, 4);
  let right = substring(bits, 4, 4);

  let s0_row = binary_to_integer(left[0], left[3]);
  let s0_col = binary_to_integer(left[1], left[2]);

  let s1_row = binary_to_integer(right[0], right[3]);
  let s1_col = binary_to_integer(right[1], right[2]);

  return concat(
    integer_to_binary(S0[s0_row][s0_col]),
    integer_to_binary(S1[s1_row][s1_col])
  );
}

function f_function(bits, key) {
  let left = substring(bits, 0, 4);
  let right = substring(bits, 4, 4);

  return concat(xor(permutation(blocks(xor(expand(right), key, 8)), P4, 4), left, 4), right);
}

function encripty(b, k1, k2) {
  return permutation(f_function(swap(f_function(permutation(b, IP, 8), k1), 8), k2), PI, 8);
}

function decripty(b, k1, k2) {
  return permutation(f_function(swap(f_function(permutation(b, IP, 8), k2), 8), k1), PI, 8);
}

function criptografar(chaverecebida, texto) {
  let [k1, k2] = get_keys(chaverecebida);
  return encripty(texto, k1, k2);
}

function descriptografar(chaverecebida, texto) {
  let [k1, k2] = get_keys(chaverecebida);
  return decripty(texto, k1, k2);
}


// exemplo de uso
let chave = "1000000000";
let texto = "00101011";


function ecbEncrypt(key, plaintext) {

  var blocks = [];
  for (var i = 0; i < plaintext.length; i += 8) {
    blocks.push(plaintext.slice(i, i + 8));
  }

  var ciphertext = "";
  for (var j = 0; j < blocks.length; j++) {

    var blockCipher = criptografar(key,blocks[j]);
    ciphertext += blockCipher;
  }

  return ciphertext;
}

// Modo ECB - Decifragem
function ecbDecrypt(key, ciphertext) {

  var blocks = [];
  for (var i = 0; i < ciphertext.length; i += 8) {
    blocks.push(ciphertext.slice(i, i + 8));
  }

  var plaintext = "";
  for (var j = 0; j < blocks.length; j++) {

    var blockPlain = descriptografar(key,blocks[j]);
    plaintext += blockPlain;
  }

  return plaintext;
}

// Modo CBC - Cifragem
function cbcEncrypt(key, plaintext, iv) {

  var blocks = [];
  for (var i = 0; i < plaintext.length; i += 8) {
    blocks.push(plaintext.slice(i, i + 8));
  }

  var ciphertext = "";
  var previousBlock = iv;
  for (var j = 0; j < blocks.length; j++) {

    var blockXor = xorBlocks(blocks[j], previousBlock);

    var blockCipher = criptografar( key, blockXor);
    ciphertext += blockCipher;
    previousBlock = blockCipher;
  }

  return ciphertext;
}

// Modo CBC - Decifragem
function cbcDecrypt(key, ciphertext, iv) {

  var blocks = [];
  for (var i = 0; i < ciphertext.length; i += 8) {
    blocks.push(ciphertext.slice(i, i + 8));
  }

  var plaintext = "";
  var previousBlock = iv;
  for (var j = 0; j < blocks.length; j++) {

    var blockPlain = descriptografar( key,blocks[j]);

    var blockXor = xorBlocks(blockPlain, previousBlock);
    plaintext += blockXor;
    previousBlock = blocks[j];
  }

  return plaintext;
}


function xorBlocks(block1, block2) {
  var xorResult = "";
  for (var i = 0; i < block1.length; i++) {
    xorResult += block1[i] === block2[i] ? "0" : "1";
  }
  return xorResult;
}


module.exports = {
  criptografar: criptografar,
  descriptografar: descriptografar,
  ecbEncrypt: ecbEncrypt,
  ecbDecrypt: ecbDecrypt,
  cbcEncrypt: cbcEncrypt,
  cbcDecrypt: cbcDecrypt
};
