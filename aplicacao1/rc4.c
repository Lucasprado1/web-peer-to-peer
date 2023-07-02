#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <iconv.h>

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

    char* result = (char*)malloc(sizeof(char) * (len * 3 + 1));  // Espaço para até 3 bytes por caractere
    memset(result, 0, sizeof(char) * (len * 3 + 1));

    iconv_t conv = iconv_open("UTF-8", "ISO-8859-1");  // Converter de ISO-8859-1 para UTF-8
    if (conv == (iconv_t)-1) {
        perror("iconv_open");
        free(ciphertext);
        free(result);
        return NULL;
    }

    size_t inbytesleft = len;
    size_t outbytesleft = len * 3;
    char* inbuf = (char*)ciphertext;
    char* outbuf = result;

    if (iconv(conv, &inbuf, &inbytesleft, &outbuf, &outbytesleft) == (size_t)-1) {
        perror("iconv");
        iconv_close(conv);
        free(ciphertext);
        free(result);
        return NULL;
    }

    iconv_close(conv);
    free(ciphertext);
    return result;

}
int main() {

    unsigned char key[256] = "teste";       // chave
    unsigned char plaintext[256] = "batata"; // texto
    criptografia(key,plaintext);
    return 0;
}