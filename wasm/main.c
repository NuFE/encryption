#include "aes.h"
#include <stdio.h>
#include <emscripten.h>
#include <string.h>

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE unsigned char * encrypt(const unsigned char *message) {
  unsigned char *encryptedMessage;
  aes(message, (size_t) strlen((const char *)message), &encryptedMessage);
  return encryptedMessage;
}
