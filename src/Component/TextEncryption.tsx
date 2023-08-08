import { Heading, Pane, Paragraph, Text, TextInputField } from 'evergreen-ui';
import { ChangeEvent, useCallback, useState } from 'react';
import useEncryption from '../hook';
import useWASM from '../wasm/useWASM';
import Module from "../wasm/wasm";
import { Icon } from './Icon';
import SelectEncryptionAlgorithm from './SelectEncryptionAlgorithm';

const TextEncryption = () => {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [encryptedText, setEncryptedText] = useState('');
  const module = useWASM(Module);
  const { encrypt } = useEncryption(module, algorithm); // Use our new hook

  const handleChangeText = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);

    // Convert the input string to bytes (assuming UTF-8 encoding).
    let encoder = new TextEncoder();
    let inputBytes = encoder.encode(event.target.value);
    let encryptedBytes = await encrypt(inputBytes);

    // Convert the encrypted bytes to a hex string.
    let encryptedText = Array.prototype.map.call(encryptedBytes, x => ('00' + x.toString(16)).slice(-2)).join('');

    setEncryptedText(encryptedText);
  }, [encrypt]);

  const handleChangeAlgorithm = useCallback(async (event: ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);

    // If there's no text, there's no need to encrypt anything
    if (text === '') {
      setEncryptedText('');
      return;
    }

    // If text exists, re-encrypt it with the new algorithm
    let encoder = new TextEncoder();
    let inputBytes = encoder.encode(text);

    // Recreate the encryption function with the new algorithm
    let encryptedBytes = await encrypt(inputBytes);

    // Convert the encrypted bytes to a hex string.
    let encryptedText = Array.prototype.map.call(encryptedBytes, x => ('00' + x.toString(16)).slice(-2)).join('');

    setEncryptedText(encryptedText);
  }, [encrypt]);

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
      <Icon src="/glass.svg" />
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

      <SelectEncryptionAlgorithm value={algorithm} onChange={handleChangeAlgorithm} />
      <p style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere', textOverflow: 'ellipsis', margin:"0 30px" }}>
        <Text size={500}>Encrypted Text: {encryptedText}</Text>
      </p>
    </Pane>
  );
}

export default TextEncryption;
