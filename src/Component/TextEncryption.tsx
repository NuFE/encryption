import { Heading, Pane, Paragraph, SelectField, Text, TextInputField } from 'evergreen-ui';
import { ChangeEvent, useCallback, useState } from 'react';
import useWASM from '../wasm/useWASM';
import Module from "../wasm/wasm";

const TextEncryption = () => {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [encryptedText, setEncryptedText] = useState('');
  const module = useWASM(Module);
  const handleChangeText = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!module) {
      console.error('module is null');
      return;
    }
    setText(event.target.value);

    // Convert the input string to bytes (assuming UTF-8 encoding).
    let encoder = new TextEncoder();
    let inputBytes = encoder.encode(event.target.value);
    // Determine how many bytes we need to add as padding.
    let paddingSize = 16 - (inputBytes.length % 16);
    // Create a new Uint8Array to hold the padded input.
    let paddedInput = new Uint8Array(inputBytes.length + paddingSize);
    // Copy the original input into the start of the new array.
    paddedInput.set(inputBytes);
    paddedInput.fill(paddingSize, inputBytes.length);
    // Allocate space in the module's heap for the input and output data.
    let inputPtr = module._malloc(paddedInput.length);

    // Copy the input data to the module's heap.
    module.HEAPU8.set(paddedInput, inputPtr);

    // Call the encryption function.
    module.ccall('encrypt', 'number', ['number', 'number'], [inputPtr, paddedInput.length]);

    // Create a new Uint8Array to hold the encrypted data.
    let encryptedBytes = new Uint8Array(module.HEAPU8.buffer, inputPtr, paddedInput.length);

    // Convert the encrypted bytes to a string (for displaying in the UI).
    let encryptedText = new TextDecoder().decode(encryptedBytes);
    setEncryptedText(encryptedText);

    // Free the memory we allocated.
    module._free(inputPtr);
  }, [module])

  const handleChangeAlgorithm = (event: ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      background="tint2"
      height="100vh"
      width="100vw"
    >
      <Heading size={700} marginBottom={20}>Encrypt your text</Heading>

      <Paragraph marginBottom={30}>
        Enter your text below, select an encryption algorithm, and see the encrypted result.
      </Paragraph>

      <TextInputField
        width={500}
        label="Original Text"
        value={text}
        onChange={handleChangeText}
        marginBottom={20}
      />

      <SelectField
        width={500}
        label="Encryption Algorithm"
        value={algorithm}
        onChange={handleChangeAlgorithm}
        marginBottom={30}
      >
        <option value="aes">AES</option>
        <option value="des">DES</option>
        <option value="rsa">RSA</option>
      </SelectField>

      <Text size={500}>Encrypted Text: {encryptedText}</Text>
    </Pane>
  );
}

export default TextEncryption;
