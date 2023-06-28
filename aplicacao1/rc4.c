#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void swap(unsigned char *a, unsigned char *b) {
  unsigned char temp = *a;
  *a = *b;
  *b = temp;
}

void rc4(unsigned char *key, unsigned char *plaintext,
         unsigned char *ciphertext, int len) {
  unsigned char S[256];
  int i, j;

  // Vetor S
  for (i = 0; i < 256; i++) {
    S[i] = i;
  }

  // Permutação inicial mostrada na aula
  for (i = 0, j = 0; i < 256; i++) {
    j = (j + S[i] + key[i % strlen((char *)key)]) % 256;
    swap(&S[i], &S[j]);
  }

  // Geração de keystream e criptografia do plaintext
  i = j = 0;
  for (int k = 0; k < len; k++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    swap(&S[i], &S[j]);
    unsigned char K = S[(S[i] + S[j]) % 256];
    ciphertext[k] = plaintext[k] ^ K;
  }
}

char* criptografia(unsigned char key[256], unsigned char plaintext[256]){

    long long int len = strlen((char *)plaintext); // Tamanho do texto

    unsigned char *ciphertext =
        (unsigned char *)malloc(len * sizeof(unsigned char));

    rc4(key, plaintext, ciphertext, len);

    for (int i = 0; i < len; i++) {
        printf("%x:", ciphertext[i]);
    }
    printf("\n");

    char* result = (char*) malloc(sizeof(char) * 256);
    strcpy(result, ciphertext);

    free(ciphertext);
    return ciphertext;

}
int main() {

    unsigned char key[256] = "teste";       // chave
    unsigned char plaintext[256] = "batata"; // texto
    criptografia(key,plaintext);
    return 0;
}