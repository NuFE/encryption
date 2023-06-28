import { Heading, Pane, Paragraph, SelectField, Text, TextInputField } from 'evergreen-ui';
import { ChangeEvent, useCallback, useState } from 'react';
import useWASM from '../wasm/useWASM';
import Module from "../wasm/wasm";
export const Entry = () => {
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('aes');
  const [encryptedText, setEncryptedText] = useState('');
  const module = useWASM(Module);
  const handleChangeText = useCallback((event:ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    module?.ccall('encrypt', "string", ["string"], [event.target.value]);
    setEncryptedText(event.target.value);
  },[module])

  const handleChangeAlgorithm = (event:ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(event.target.value);
  }

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={50}
      background="tint2"
      height="100vh"
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
