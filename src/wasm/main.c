#include <stdio.h>
#include <emscripten.h>
#include <string.h>
#include "aes.h"
#include "des.h"
#include "des_top.h"
#ifndef EXTERN
#define EXTERN
#endif

// Function declarations
void aes_buf(uint8_t *buf, size_t length);
void des_buf(uint8_t *buf, size_t length);

void printBuffer(uint8_t *buf, size_t length) {
    for (size_t i = 0; i < length; i++) {
        printf("%02x", buf[i]);
    }
    printf("\n");
}

EXTERN EMSCRIPTEN_KEEPALIVE uint8_t* encrypt(uint8_t *buf, size_t length, char* encMode) {
    printf("The encryption mode is %c\n", *encMode);
    printf("The length is %zu\n", length);
    printf("before encryption\n");
    printBuffer(buf, length);
    
    switch (*encMode) {
        case 'a': // AES encryption
            aes_buf(buf, length);
            break;
        case 'd': // DES encryption
            des_buf(buf, length);
            break;
        default:
            printf("Invalid encryption mode, must be 'a' or 'd'\n, here is the encryption mode: %c\n", *encMode);
            return buf;
    }
    printf("after encryption\n");
    printBuffer(buf, length);

    return buf;
}

// AES encryption function
void aes_buf(uint8_t *buf, size_t length) {
    printf("AES encryption\n");
    struct AES_ctx ctx;
    uint8_t key[AES_KEYLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66};
    uint8_t iv[AES_BLOCKLEN] = {0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66};
    printf("The length is %zu\n", length);
    // Ensure the buffer length is a multiple of AES_BLOCKLEN
    if (length % AES_BLOCKLEN != 0) {
        printf("Buffer length is not a multiple of AES_BLOCKLEN");
        return;
    }
    printf("Aes_init_ctx_iv\n");
    // Initialize the context with the key and IV
    AES_init_ctx_iv(&ctx, key, iv);
    printf("Aes_cbc_encrypt_buffer\n");
    // Encrypt the buffer
    AES_CBC_encrypt_buffer(&ctx, buf, length);
    printf("End of AES encryption\n");
}
void des_buf(uint8_t *buf, size_t length) {
    // Key for DES encryption
    unsigned int des_key[2] = {0x12345678, 0x90abcdef}; 

    // Make sure the buffer length is a multiple of 8 (DES block size)
    if (length % 8 != 0) {
        printf("Buffer length is not a multiple of 8");
        return;
    }

    // Convert buf to 64-bit blocks
    unsigned int *buf_64 = (unsigned int *)buf;

    // Encrypt each 64-bit block
    for (size_t i = 0; i < length / 8; i++) {
        unsigned int keys[17*2] = {0}; // To store keys produced from the key schedule
        initDES(des_key, keys); // Run the key schedule

        // Initialize a new buffer for the IIP
        unsigned int iip[2] = {0};

        DES((unsigned char *)(buf_64 + i*2), keys, iip, 0); // Encrypt the block

        // Assign the encrypted value back to the original buffer
        *(buf_64 + i*2) = iip[0];
        *(buf_64 + i*2 + 1) = iip[1];
    }

    //print the hex values of the encrypted buffer
    printf("Encrypted buffer: ");
    for (size_t i = 0; i < length / 8; i++) {
        printf("%08x%08x ", *(buf_64 + i*2), *(buf_64 + i*2 + 1));
    }
    printf("\nEnd of DES encryption\n");
}
