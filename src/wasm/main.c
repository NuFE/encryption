#include <stdio.h>
#include <emscripten.h>
#include <string.h>
#include "aes.h"
// Include the DES header file here

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

// Function declarations
void aes_buf(uint8_t *buf, size_t length);
uint64_t des(uint8_t *buf, size_t length, uint64_t key, char mode);

// Main encryption function
EXTERN EMSCRIPTEN_KEEPALIVE uint8_t *encrypt(uint8_t *buf, size_t length, char encMode) {
    printf("The length is %zu\n", length);
    printf("The buffer is %s\n", buf);

    // Key for DES encryption
    uint64_t des_key = 0x1234567890abcdef; // Replace with your actual DES key

    // Select the encryption mode
    switch (encMode) {
        case 'a': // AES encryption
            aes_buf(buf, length);
            break;
        case 'd': // DES encryption
            des(buf, length, des_key, 'e'); // Assuming 'e' stands for encryption
            break;
        default:
            printf("Invalid encryption mode\n");
            return buf;
    }

    printf("The buffer after encryption is %s\n", buf);

    return buf;
}

// AES encryption function
void aes_buf(uint8_t *buf, size_t length) {
    struct AES_ctx ctx;
    uint8_t key[AES_KEYLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66};
    uint8_t iv[AES_BLOCKLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66};

    // Ensure the buffer length is a multiple of AES_BLOCKLEN
    if (length % AES_BLOCKLEN != 0) {
        printf("Buffer length is not a multiple of AES_BLOCKLEN");
        return;
    }

    // Initialize the context with the key and IV
    AES_init_ctx_iv(&ctx, key, iv);

    // Encrypt the buffer
    AES_CBC_encrypt_buffer(&ctx, buf, length);
}
