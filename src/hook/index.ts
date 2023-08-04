// useEncryption.ts
import { useCallback } from "react";
import Module from "../wasm/wasm";

const useEncryption = (module: Module | null, algorithm: string) => {
  const encrypt =useCallback((inputBytes: Uint8Array) => {
    let paddedInput;
    let paddingSize;
    switch (algorithm) {
      case 'des':
        paddingSize = 8 - (inputBytes.length % 8);
        break;
      case 'aes':
      default:
        paddingSize = 16 - (inputBytes.length % 16);
        break;
    }
    paddedInput = new Uint8Array(inputBytes.length + paddingSize);
    paddedInput.set(inputBytes);
    paddedInput.fill(paddingSize, inputBytes.length);
    // Allocate space in the module's heap for the input and output data.
    let inputPtr = module._malloc(paddedInput.length);

    // Copy the input data to the module's heap.
    module.HEAPU8.set(paddedInput, inputPtr);

    // Call the encryption function.
    let resultPtr = module.ccall('encrypt', 'number', ['number', 'number', 'string'], [inputPtr, paddedInput.length, algorithm[0]]);

    // Create a new Uint8Array to hold the encrypted data.
    let encryptedBytes = new Uint8Array(module.HEAPU8.buffer, resultPtr, paddedInput.length);

    // Free the memory we allocated.
    module._free(resultPtr);
    module._free(inputPtr);

    return encryptedBytes;
  }, [module, algorithm]);
  return { encrypt };
};

export default useEncryption;
