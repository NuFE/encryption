
#include <stdio.h>
#include <emscripten.h>
#include <string.h>
#include "aes.h"

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

void aes_buf(uint8_t *buf, size_t length);

EXTERN EMSCRIPTEN_KEEPALIVE uint8_t * encrypt(uint8_t *buf, size_t length) {
  printf("the length is %zu\n", length);
  printf("the buf is %s\n", buf);
  aes_buf(buf, length);
  printf("the buf after is %s\n", buf);
  //print buf as string
  return buf;
}

void aes_buf(uint8_t *buf, size_t length) {
  struct AES_ctx ctx;
  uint8_t key[AES_KEYLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 
                             0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66}; // Your AES key here

  // Initialization Vector (IV) for CBC mode
  uint8_t iv[AES_BLOCKLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 
                              0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66}; // Your IV here

  // Ensure the buffer length is a multiple of AES_BLOCKLEN
  if (length % AES_BLOCKLEN != 0) {
    printf("Buffer length is not a multiple of AES_BLOCKLEN");
    return;
  }

  // Initialize the context with the key and IV
  AES_init_ctx_iv(&ctx, key, iv);

  // Encrypt the buffer
  AES_CBC_encrypt_buffer(&ctx, buf, length);

  // At this point, buf contains the encrypted data
  return;
}
